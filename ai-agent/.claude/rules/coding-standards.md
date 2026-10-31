# Rule: Coding Standards

**Applies to:** All source files under `src/`

## TypeScript

- `"strict": true` in `tsconfig.json` — non-negotiable
- No `any` without a `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment explaining why
- Prefer `unknown` for values of uncertain type; narrow explicitly
- Use `satisfies` operator for config objects to preserve literal types
- Explicit return types on all exported functions and methods
- Use `readonly` for properties that should not be mutated

## Naming Conventions

| Construct | Convention | Example |
|---|---|---|
| Variables / params | camelCase | `userId` |
| Functions | camelCase | `getUserById` |
| Classes | PascalCase | `UserRepository` |
| Interfaces | PascalCase (no `I` prefix) | `UserProfile` |
| Types | PascalCase | `ApiResponse<T>` |
| Enums | PascalCase | `HttpStatus` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| React components | PascalCase | `UserCard` |
| Files (components) | PascalCase | `UserCard.tsx` |
| Files (utilities) | kebab-case | `format-date.ts` |

## File Organization (per module)

```
src/
  components/       # React components
    UserCard/
      UserCard.tsx
      UserCard.test.tsx
      UserCard.module.css (if using CSS Modules)
  hooks/            # Custom React hooks
  services/         # Business logic
  repositories/     # Data access
  api/              # Route handlers
  types/            # Shared TypeScript types
  utils/            # Pure utility functions
  __tests__/        # Integration tests
```

## React Specifics

- Functional components only (no class components)
- Props typed with an `interface` directly above the component
- No `React.FC<Props>` — just `function MyComponent(props: Props)`
- `key` props must be stable IDs, never array indices
- Side effects only in `useEffect` — not in render
- Lift state to the lowest common ancestor, no higher

## Error Handling

```typescript
// ✅ Correct — typed error envelope
throw new AppError('USER_NOT_FOUND', 'User does not exist', { userId });

// ❌ Wrong — untyped, no context
throw new Error('not found');
```

- Never swallow errors silently: `catch (e) { }` is forbidden
- Log errors with structured context: `logger.error({ err, userId }, 'Operation failed')`
- Return `Result<T, E>` pattern for recoverable errors; throw for programmer errors

## Imports

- Absolute imports from `src/` root (configure `paths` in tsconfig)
- External deps before internal
- No barrel files (`index.ts`) that re-export everything — they slow build tools
