// @vitest-environment node

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");

function filesWithin(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesWithin(path) : [path];
  });
}

const files = filesWithin(sourceRoot);
const modules = files
  .filter((path) => extname(path) === ".tsx")
  .map((path) => ({
    path: relative(sourceRoot, path),
    ast: ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    ),
  }));

function walk(node: ts.Node, visit: (node: ts.Node) => void): void {
  visit(node);
  node.forEachChild((child) => walk(child, visit));
}

/** Includes type-only dependencies and re-exports, which can also break layers. */
function imports(ast: ts.SourceFile): string[] {
  const specifiers = new Set<string>();
  walk(ast, (node) => {
    let value: ts.Node | undefined;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      value = node.moduleSpecifier;
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument)
    ) {
      value = node.argument.literal;
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      value = node.moduleReference.expression;
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) &&
          node.expression.text === "require"))
    ) {
      value = node.arguments[0];
    }
    if (value && ts.isStringLiteralLike(value)) specifiers.add(value.text);
  });
  return [...specifiers];
}

function localTarget(source: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? resolve(sourceRoot, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(sourceRoot, dirname(source), specifier)
      : null;
  if (!base) return null;
  const candidates = [
    base,
    `${base}.tsx`,
    `${base}.json`,
    resolve(base, "index.tsx"),
  ];
  const target = candidates.find((path) => {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  });
  if (!target)
    throw new Error(`Unresolved local dependency: ${source} → ${specifier}`);
  return relative(sourceRoot, target);
}

const dependencies = modules.flatMap(({ path, ast }) =>
  imports(ast).map((specifier) => ({
    source: path,
    specifier,
    target: localTarget(path, specifier),
  })),
);

const featureLocation = (path: string) =>
  /^features\/([^/]+)\/([^/]+)/.exec(path);

const allowedLayers: Record<string, readonly string[]> = {
  domain: ["domain"],
  application: ["application", "domain"],
  infrastructure: ["infrastructure", "domain"],
  presentation: ["presentation", "domain"],
  "index.tsx": ["presentation", "domain"],
  "server.tsx": ["application", "infrastructure", "domain"],
};

describe("application architecture", () => {
  it("keeps application modules in TSX and feature records in infrastructure", () => {
    expect(
      files
        .map((path) => relative(sourceRoot, path))
        .filter(
          (path) =>
            /\.(?:[cm]?[jt]s|jsx)$/.test(path) ||
            (path.startsWith("features/") &&
              path.endsWith(".json") &&
              !/^features\/[^/]+\/infrastructure\/data\//.test(path)),
        ),
    ).toEqual([]);
  });

  it("keeps feature dependencies inside their layer boundaries", () => {
    const violations = dependencies.filter(({ source, target }) => {
      const from = featureLocation(source);
      if (!from) return false;
      const [, feature, layer] = from;
      if (!allowedLayers[layer]) return true;
      // Only presentation can depend on reusable UI and browser utilities.
      if (target?.startsWith("shared/")) return layer !== "presentation";
      // Inner layers stay independent of frameworks and platform packages.
      if (!target) return layer === "domain" || layer === "application";
      const to = featureLocation(target);
      return !to || to[1] !== feature || !allowedLayers[layer].includes(to[2]);
    });
    expect(violations).toEqual([]);
  });

  it("keeps shared independent and composes features through public APIs", () => {
    const violations = dependencies.filter(({ source, target }) => {
      if (!target) return false;
      if (source.startsWith("shared/")) return !target.startsWith("shared/");
      if (!source.startsWith("app/") || !target.startsWith("features/"))
        return false;
      if (/^features\/[^/]+\/index\.tsx$/.test(target)) return false;
      return (
        !source.startsWith("app/_composition/") ||
        !/^features\/[^/]+\/server\.tsx$/.test(target)
      );
    });
    expect(violations).toEqual([]);
  });

  it("keeps inner layers free of JSX and browser globals", () => {
    const violations: string[] = [];
    const browserGlobals = new Set([
      "window",
      "document",
      "navigator",
      "localStorage",
      "sessionStorage",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "matchMedia",
      "IntersectionObserver",
      "ResizeObserver",
      "Image",
      "fetch",
      "CanvasRenderingContext2D",
      "OffscreenCanvas",
      "MediaQueryList",
      "Document",
      "Window",
      "React",
      "JSX",
    ]);
    for (const { path, ast } of modules) {
      const location = featureLocation(path);
      if (
        !location ||
        !["domain", "application", "infrastructure"].includes(location[2])
      )
        continue;
      walk(ast, (node) => {
        if (
          ts.isJsxElement(node) ||
          ts.isJsxSelfClosingElement(node) ||
          ts.isJsxFragment(node)
        )
          violations.push(`${path}: JSX belongs in presentation`);
        if (location[2] === "infrastructure") return;
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === "globalThis" &&
          browserGlobals.has(node.name.text)
        )
          violations.push(`${path}: browser dependency ${node.getText(ast)}`);
        if (
          ts.isExpressionStatement(node) &&
          ts.isStringLiteral(node.expression) &&
          node.expression.text === "use client"
        )
          violations.push(`${path}: client directive in an inner layer`);
        if (
          ts.isIdentifier(node) &&
          (browserGlobals.has(node.text) ||
            /^(?:HTML|SVG)\w*Element$/.test(node.text)) &&
          !(
            ts.isPropertyAccessExpression(node.parent) &&
            node.parent.name === node
          ) &&
          !(
            (ts.isPropertyAssignment(node.parent) ||
              ts.isPropertySignature(node.parent)) &&
            node.parent.name === node
          )
        )
          violations.push(`${path}: browser dependency ${node.text}`);
      });
    }
    expect(violations).toEqual([]);
  });
});
