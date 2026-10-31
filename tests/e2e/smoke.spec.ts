import { test, expect } from "@playwright/test";
import profileContent from "../../src/features/profile/infrastructure/data/profile.json";
const { profile } = profileContent;

test.describe("Smoke — page load", () => {
  test("loads the page without console errors and renders the h1", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(profile.headline);
    await expect(
      page.getByRole("link", { name: "Khuong Nguyen Huu", exact: true }),
    ).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("renders the section anchors in the navbar", async ({ page }) => {
    await page.goto("/");
    await expect(
      page
        .getByRole("navigation", { name: "Primary navigation" })
        .locator('a[href="#timeline"]'),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Primary navigation" })
        .locator('a[href="#skills"]'),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Primary navigation" })
        .locator('a[href="#contact"]'),
    ).toBeVisible();
  });

  test("header and page follow About, Timeline, Work, Skills, Contact", async ({
    page,
  }) => {
    const ids = ["about", "timeline", "work", "skills", "contact"];
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    const links = await nav
      .locator("ul")
      .first()
      .locator("a")
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("href")),
      );
    expect(links).toEqual(ids.map((id) => `#${id}`));
    const sectionIds = await page
      .locator("main > section")
      .evaluateAll((elements) => elements.map((element) => element.id));
    expect(sectionIds.filter((id) => ids.includes(id))).toEqual(ids);
    for (const id of ids) {
      await nav.locator(`a[href="#${id}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect
        .poll(() =>
          page
            .locator(`#${id}`)
            .evaluate((element) =>
              Math.abs(element.getBoundingClientRect().top - 90),
            ),
        )
        .toBeLessThan(5);
    }
  });

  test("scrolls smoothly to About from the header", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const about = page.locator("#about");
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/#about$/);
    const duringScroll = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(160);
    const nextPosition = await page.evaluate(() => window.scrollY);
    expect(nextPosition).toBeGreaterThan(duringScroll);
    await expect
      .poll(
        () =>
          about.evaluate((element) =>
            Math.abs(element.getBoundingClientRect().top - 90),
          ),
        { timeout: 8000 },
      )
      .toBeLessThan(5);
  });

  test("returns to the start of About from Contact", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#contact").evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 90,
        behavior: "instant",
      }),
    );
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/#about$/);
    await expect
      .poll(
        () =>
          page
            .locator("#about-scroll-start")
            .evaluate((element) =>
              Math.abs(element.getBoundingClientRect().top - 90),
            ),
        { timeout: 10000 },
      )
      .toBeLessThan(5);
    await expect(
      page.locator("#about").getByText(/ABOUT \/ KHUONG NGUYEN HUU/),
    ).toBeInViewport();
  });

  test("serves sitemap.xml at the root URL", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("serves robots.txt at the root URL", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });
});

test("mobile navigation closes with its own trigger and Escape returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const close = page.getByRole("button", { name: "Close navigation menu" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await close.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.locator('#mobile-menu a[href="#timeline"]').focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
});

test("mobile About navigation reaches the section with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.locator('#mobile-menu a[href="#about"]').click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#mobile-menu")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator("#about")
        .evaluate((element) =>
          Math.abs(element.getBoundingClientRect().top - 90),
        ),
    )
    .toBeLessThan(5);
});
