import { test, expect } from "@playwright/test";
import milestones from "../../src/features/timeline/infrastructure/data/timeline.json";
import skillGroups from "../../src/features/skills/infrastructure/data/skills.json";
const skills = Object.values(skillGroups).flat();
import profileContent from "../../src/features/profile/infrastructure/data/profile.json";
const { employment, profile } = profileContent;
import projects from "../../src/features/work/infrastructure/data/projects.json";

test.describe("Reference portfolio presentation", () => {
  test("preserves the profile, every supplied milestone, and every skill", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Khuong Nguyen Huu/);
    await expect(page.locator("#about")).toContainText(profile.summary);
    for (const job of employment) {
      await expect(page.locator("#about")).toContainText(job.role);
      await expect(page.locator("#about")).toContainText(job.company);
      await expect(page.locator("#about")).toContainText(job.dates);
    }
    await expect(page.locator("#timeline article")).toHaveCount(
      milestones.length,
    );
    for (const milestone of milestones) {
      const article = page.getByRole("article", {
        name: `${milestone.role} at ${milestone.company}`,
      });
      await expect(article).toContainText(milestone.description);
      await expect(article).toContainText(milestone.dateLabel);
      for (const point of milestone.responsibilities ?? [])
        await expect(article).toContainText(point);
      for (const tech of milestone.technologies ?? [])
        await expect(article).toContainText(tech);
    }
    for (const skill of skills)
      await expect(page.locator("#skills")).toContainText(skill.label);
    await expect(page.locator("#contact")).toContainText(profile.email);
    await expect(page.locator("#contact")).toContainText(profile.phone);
    await expect(page.locator("body")).not.toContainText("Rohit Mishra");
    await expect(page.locator("body")).not.toContainText(
      "mishrarohit27112005@gmail.com",
    );
    await expect(page.getByTestId("character-journey")).toHaveCount(1);
  });

  test("shows every CV project detail in the Work section", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const work = page.locator("#work");
    await expect(work.getByRole("article")).toHaveCount(6);
    for (const project of projects) {
      const article = work.getByRole("article", {
        name: `${project.title} project`,
      });
      await expect(article).toContainText(project.title);
      await expect(article).toContainText(project.company);
      await expect(article).toContainText(project.role);
      await expect(article).toContainText(project.dateLabel);
      await expect(article).toContainText(project.description);
      for (const point of project.responsibilities)
        await expect(article).toContainText(point);
      for (const group of project.technologyGroups) {
        await expect(article).toContainText(group.label);
        for (const tech of group.items)
          await expect(article).toContainText(tech);
      }
    }
    const first = work.getByRole("article", {
      name: `${projects[0].title} project`,
    });
    await first.scrollIntoViewIfNeeded();
    const description = await first
      .getByRole("heading", { name: "Project Description" })
      .boundingBox();
    const responsibilities = await first
      .getByRole("heading", { name: "Responsibilities" })
      .boundingBox();
    const technologies = await first
      .getByRole("heading", { name: "Technologies" })
      .boundingBox();
    expect(description && responsibilities && technologies).toBeTruthy();
    expect(responsibilities!.y).toBeGreaterThan(description!.y);
    expect(technologies!.x).toBeGreaterThan(description!.x);
    const descriptionColumn = await first
      .getByRole("heading", { name: "Project Description" })
      .locator("..")
      .boundingBox();
    const technologiesColumn = await first
      .getByRole("heading", { name: "Technologies" })
      .locator("..")
      .boundingBox();
    expect(descriptionColumn!.width).toBeGreaterThan(technologiesColumn!.width);
    await expect(
      first
        .locator("a > div:not([aria-hidden]) li")
        .filter({ hasText: "AngularJS" })
        .first(),
    ).toBeVisible();
  });

  test("keeps the current image still while the pinned hero text scrolls", async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    const olderFrameRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.url().includes("/frames/modal-1/"))
        olderFrameRequests.push(request.url());
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const canvas = page.getByTestId("hero-image");
    await expect(canvas).toHaveAttribute("data-image-ready", "true");
    await expect(page.locator("#hero").locator("..")).toHaveClass(/pin-spacer/);
    const start = await canvas.evaluate((element: HTMLCanvasElement) =>
      element.toDataURL(),
    );
    await page.evaluate(() =>
      window.scrollTo({ top: innerHeight * 2.5, behavior: "instant" }),
    );
    await expect(page.locator("#hero")).toBeInViewport();
    expect(
      await canvas.evaluate((element: HTMLCanvasElement) =>
        element.toDataURL(),
      ),
    ).toBe(start);
    await page.screenshot({
      path: testInfo.outputPath("hero-mid-scroll.png"),
      animations: "disabled",
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(olderFrameRequests).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("restores the zigzag walking timeline with the current display and body fonts", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/#timeline");
    // Wait for initial anchor restoration before sampling manual scroll progress.
    await expect
      .poll(() =>
        page
          .locator("#timeline")
          .evaluate((element) =>
            Math.abs(element.getBoundingClientRect().top - 90),
          ),
      )
      .toBeLessThan(5);
    const route = page.getByTestId("timeline-route");
    const journey = page.getByTestId("character-journey");
    const xs: number[] = [];
    for (const progress of [0.1, 0.25, 0.5, 0.75, 0.9, 0.5]) {
      await route.evaluate((element, fraction) => {
        const top = element.getBoundingClientRect().top + scrollY;
        window.scrollTo({
          top:
            top +
            ((element as HTMLElement).offsetHeight - innerHeight) * fraction,
          behavior: "instant",
        });
      }, progress);
      await expect
        .poll(async () => Number(await journey.getAttribute("data-progress")))
        .toBeCloseTo(progress, 2);
      xs.push(
        await page
          .getByTestId("timeline-traveler")
          .evaluate((element) => parseFloat(element.style.left)),
      );
    }
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(500);
    const sprite = page.getByTestId("journey-senior-sprite");
    await expect(sprite).toHaveCSS("opacity", "1");
    await expect(sprite).toHaveAttribute("data-frame-count", "8");
    const frames = new Set<string>();
    await expect
      .poll(
        async () => {
          frames.add(
            await sprite.evaluate(
              (element) => getComputedStyle(element).backgroundPosition,
            ),
          );
          return frames.size;
        },
        { timeout: 3000, intervals: [60] },
      )
      .toBeGreaterThanOrEqual(5);
    expect(
      await page
        .locator("#timeline h3")
        .first()
        .evaluate((element) => getComputedStyle(element).fontFamily),
    ).toContain("Space Grotesk");
    expect(
      await page
        .locator("#timeline article p")
        .first()
        .evaluate((element) => getComputedStyle(element).fontFamily),
    ).toContain("Inter");
    await expect(page.getByText("Small steps. Real progress.")).toHaveCount(0);
  });

  test("crossfades through Student, Junior, Middle and Senior in both scroll directions", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/#timeline");
    await expect
      .poll(() =>
        page
          .locator("#timeline")
          .evaluate((element) =>
            Math.abs(element.getBoundingClientRect().top - 90),
          ),
      )
      .toBeLessThan(5);

    const traveler = page.getByTestId("timeline-traveler");
    const student = page.getByTestId("journey-sprite");
    const junior = page.getByTestId("journey-junior-sprite");
    const middle = page.getByTestId("journey-middle-sprite");
    const senior = page.getByTestId("journey-senior-sprite");
    await expect(traveler).toHaveAttribute("data-stage", "student");
    await expect(student).toHaveCSS("opacity", "1");
    await expect(junior).toHaveCSS("opacity", "0");
    await expect(middle).toHaveCSS("opacity", "0");
    await expect(senior).toHaveCSS("opacity", "0");

    const reachMilestone = async (id: number, direction = 1) => {
      await expect
        .poll(
          async () => {
            const current = await page
              .locator(`#milestone-${id}`)
              .evaluate((element) =>
                element.closest("li")?.getAttribute("aria-current"),
              );
            if (current !== "step") {
              await page.evaluate(
                (direction) =>
                  window.scrollBy({ top: 48 * direction, behavior: "instant" }),
                direction,
              );
            }
            return current;
          },
          { timeout: 8000, intervals: [32] },
        )
        .toBe("step");
    };
    await reachMilestone(1);
    await expect(traveler).toHaveAttribute("data-stage", "junior");
    await expect
      .poll(
        () =>
          junior.evaluate((element) => {
            const opacity = Number(getComputedStyle(element).opacity);
            return opacity > 0 && opacity < 1;
          }),
        { intervals: [16] },
      )
      .toBe(true);
    await expect(junior).toHaveCSS("opacity", "1");
    await expect(student).toHaveCSS("opacity", "0");

    await reachMilestone(2);
    await expect(traveler).toHaveAttribute("data-stage", "middle");
    await expect
      .poll(
        () =>
          middle.evaluate((element) => {
            const opacity = Number(getComputedStyle(element).opacity);
            return opacity > 0 && opacity < 1;
          }),
        { intervals: [16] },
      )
      .toBe(true);
    await expect(middle).toHaveCSS("opacity", "1");
    await expect(junior).toHaveCSS("opacity", "0");

    await reachMilestone(3);
    await expect(traveler).toHaveAttribute("data-stage", "senior");
    await expect
      .poll(
        () =>
          senior.evaluate((element) => {
            const opacity = Number(getComputedStyle(element).opacity);
            return opacity > 0 && opacity < 1;
          }),
        { intervals: [16] },
      )
      .toBe(true);
    await expect(senior).toHaveCSS("opacity", "1");
    await expect(middle).toHaveCSS("opacity", "0");

    await reachMilestone(2, -1);
    await expect(traveler).toHaveAttribute("data-stage", "middle");
    await expect(middle).toHaveCSS("opacity", "1");
    await expect(senior).toHaveCSS("opacity", "0");

    await reachMilestone(1, -1);
    await expect(traveler).toHaveAttribute("data-stage", "junior");
    await expect(junior).toHaveCSS("opacity", "1");
    await expect(middle).toHaveCSS("opacity", "0");

    await page.getByTestId("timeline-route").evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollY - 90,
        behavior: "instant",
      }),
    );
    await expect(traveler).toHaveAttribute("data-stage", "student");
    await expect(student).toHaveCSS("opacity", "1");
    await expect(junior).toHaveCSS("opacity", "0");
  });

  for (const reducedMotion of [false, true]) {
    test(`turns the character when wheel direction reverses (${reducedMotion ? "mobile reduced motion" : "desktop smooth scrolling"})`, async ({
      page,
    }) => {
      await page.emulateMedia({
        reducedMotion: reducedMotion ? "reduce" : "no-preference",
      });
      const viewport = reducedMotion
        ? { width: 390, height: 844 }
        : { width: 1440, height: 1000 };
      await page.setViewportSize(viewport);
      await page.goto("/#milestone-3");
      await expect
        .poll(() =>
          page
            .locator("#milestone-3")
            .evaluate((element) =>
              Math.abs(element.getBoundingClientRect().top - 90),
            ),
        )
        .toBeLessThan(5);
      const start = await page.evaluate(() => scrollY);
      await page.mouse.move(viewport.width - 24, viewport.height / 2);
      await page.mouse.wheel(0, 200);
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeGreaterThan(start + 160);
      const journey = page.getByTestId("character-journey");
      const traveler = page.getByTestId("timeline-traveler");
      const character = page.getByTestId("journey-senior-sprite").locator("..");
      await expect(traveler).toHaveAttribute("data-stage", "senior");
      await expect(journey).toHaveAttribute("data-direction", "forward");
      const forwardFacing = await traveler.getAttribute("data-facing");

      if (reducedMotion) {
        const beforeSmallReverse = await page.evaluate(() => scrollY);
        await page.mouse.wheel(0, -40);
        await expect
          .poll(() => page.evaluate(() => scrollY))
          .toBeLessThan(beforeSmallReverse - 30);
        await expect(journey).toHaveAttribute("data-direction", "forward");
        await expect(traveler).toHaveAttribute("data-facing", forwardFacing!);
      }

      await page.mouse.wheel(0, -100);
      await expect(journey).toHaveAttribute("data-direction", "backward");
      const reverseFacing = forwardFacing === "right" ? "left" : "right";
      await expect(traveler).toHaveAttribute("data-stage", "senior");
      await expect(
        page.locator("#timeline [aria-current='step'] #milestone-3"),
      ).toHaveCount(1);
      await expect(traveler).toHaveAttribute("data-facing", reverseFacing);
      await expect(character).toHaveCSS(
        "transform",
        reverseFacing === "left"
          ? "matrix(-1, 0, 0, 1, 0, 0)"
          : "matrix(1, 0, 0, 1, 0, 0)",
      );
      await expect(character).toHaveCSS(
        "transition-duration",
        reducedMotion ? "0s" : "0.18s",
      );

      await page.mouse.wheel(0, 100);
      await expect(journey).toHaveAttribute("data-direction", "forward");
      await expect(traveler).toHaveAttribute("data-facing", forwardFacing!);
    });
  }

  test("keeps the student visible if the career images cannot load", async ({
    page,
  }) => {
    for (const stage of ["junior", "middle", "senior"]) {
      await page.route(`**/images/journey/${stage}-walk-cycle.webp`, (route) =>
        route.abort(),
      );
    }
    await page.goto("/#work");
    await expect(page.getByTestId("character-journey")).toHaveAttribute(
      "data-progress",
      "1.000",
    );
    await expect(page.getByTestId("timeline-traveler")).toHaveAttribute(
      "data-stage",
      "student",
    );
    await expect(page.getByTestId("journey-sprite")).toHaveCSS("opacity", "1");
  });

  test("keeps Junior visible if later images cannot load", async ({ page }) => {
    await page.route("**/images/journey/middle-walk-cycle.webp", (route) =>
      route.abort(),
    );
    await page.route("**/images/journey/senior-walk-cycle.webp", (route) =>
      route.abort(),
    );
    await page.goto("/#work");
    await expect(page.getByTestId("character-journey")).toHaveAttribute(
      "data-progress",
      "1.000",
    );
    await expect(page.getByTestId("timeline-traveler")).toHaveAttribute(
      "data-stage",
      "junior",
    );
    await expect(page.getByTestId("journey-junior-sprite")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.getByTestId("journey-middle-sprite")).toHaveCSS(
      "opacity",
      "0",
    );
  });

  test("keeps Middle visible if the Senior image cannot load", async ({
    page,
  }) => {
    await page.route("**/images/journey/senior-walk-cycle.webp", (route) =>
      route.abort(),
    );
    await page.goto("/#work");
    await expect(page.getByTestId("character-journey")).toHaveAttribute(
      "data-progress",
      "1.000",
    );
    await expect(page.getByTestId("timeline-traveler")).toHaveAttribute(
      "data-stage",
      "middle",
    );
    await expect(page.getByTestId("journey-middle-sprite")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.getByTestId("journey-senior-sprite")).toHaveCSS(
      "opacity",
      "0",
    );
  });

  test("keeps navigation readable on light sections and links work rows to the original career details", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.locator("#skills").evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollY + 20,
        behavior: "instant",
      }),
    );
    await expect(page.locator("header").first()).toHaveCSS(
      "color",
      "rgb(11, 11, 11)",
    );
    const workLink = page.locator("#work a").first();
    await workLink.scrollIntoViewIfNeeded();
    await workLink.hover();
    const overlay = workLink.locator(":scope > div[aria-hidden='true']");
    await expect
      .poll(() =>
        overlay.evaluate((element) => getComputedStyle(element).clipPath),
      )
      .toBe("inset(0px)");
    await workLink.click();
    await expect(page).toHaveURL(/#milestone-2$/);
    await expect(page.locator("#milestone-2")).toBeInViewport();
  });

  test("keeps the reference layout readable on mobile and under reduced motion", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByTestId("hero-image")).toHaveAttribute(
      "data-image-ready",
      "true",
    );
    await expect(page.locator("#hero").locator("..")).not.toHaveClass(
      /pin-spacer/,
    );
    await page.screenshot({
      path: testInfo.outputPath("reference-mobile-hero.png"),
      animations: "disabled",
    });
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      for (const id of ["about", "skills", "timeline", "work", "contact"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          )
          .toBe(true);
      }
      const lastEmployment = page.locator("#about ol li").last();
      await lastEmployment.scrollIntoViewIfNeeded();
      await expect(lastEmployment).toBeInViewport({ ratio: 1 });
    }
    for (const card of await page.locator("#timeline article").all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveCSS("opacity", "1");
      await expect(card.getByRole("heading")).toBeVisible();
    }
    const senior = page.getByTestId("journey-senior-sprite");
    await expect(page.getByTestId("timeline-traveler")).toHaveAttribute(
      "data-stage",
      "senior",
    );
    await expect(senior).toHaveCSS("opacity", "1");
    await expect(senior).toHaveCSS("animation-name", "none");
    await expect(senior).toHaveCSS("transition-duration", "0s");
  });
});
