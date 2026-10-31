import { expect, test, type Page } from "@playwright/test";

async function expectAnchor(page: Page, id: string) {
  await expect(page.getByTestId("hero-image")).toHaveAttribute(
    "data-image-ready",
    "true",
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect
    .poll(
      () =>
        page
          .locator(`#${id}`)
          .evaluate((element) =>
            Math.abs(element.getBoundingClientRect().top - 90),
          ),
      { timeout: 8000 },
    )
    .toBeLessThan(5);
}

for (const reducedMotion of [false, true]) {
  test(`refresh without a selected section returns to the top (${reducedMotion ? "mobile reduced motion" : "desktop motion"})`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: reducedMotion ? "reduce" : "no-preference",
    });
    await page.setViewportSize(
      reducedMotion
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
    );
    await page.goto("/");
    await expect(page.getByTestId("hero-image")).toHaveAttribute(
      "data-image-ready",
      "true",
    );
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(500);
    expect(await page.evaluate(() => window.location.hash)).toBe("");

    await page.reload();
    await expect(page.getByTestId("hero-image")).toHaveAttribute(
      "data-image-ready",
      "true",
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(5);
  });

  test(`refresh returns to the selected section (${reducedMotion ? "mobile reduced motion" : "desktop motion"})`, async ({
    page,
  }) => {
    await page.emulateMedia({
      reducedMotion: reducedMotion ? "reduce" : "no-preference",
    });
    await page.setViewportSize(
      reducedMotion
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
    );
    await page.goto("/");
    if (reducedMotion)
      await page.getByRole("button", { name: "Open navigation menu" }).click();
    const id = reducedMotion ? "skills" : "work";
    const navigation = reducedMotion
      ? page.locator("#mobile-menu")
      : page.getByRole("navigation", { name: "Primary navigation" });
    await navigation.locator(`a[href="#${id}"]`).click();
    await expectAnchor(page, id);

    // Keep the chosen URL but leave its section before refreshing.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await page.reload();
    await expectAnchor(page, id);

    // Restoration is one-time: subsequent scrolling/resizing remains free.
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      window.dispatchEvent(new Event("resize"));
    });
    await page.waitForTimeout(350);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(5);
  });
}

test("missing or malformed section hashes fall back to the top", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  await expectAnchor(page, "work");
  for (const hash of ["#missing-section", "#%E0%A4%A"]) {
    await page.locator("#work").scrollIntoViewIfNeeded();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(500);
    await page.evaluate((value) => {
      window.location.hash = value;
    }, hash);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(5);
  }
});

test("cold links align About and project milestones after hero pinning", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const id of ["about", "milestone-2"]) {
    await page.goto(`/#${id}`);
    await expect(page.locator("#hero").locator("..")).toHaveClass(/pin-spacer/);
    await expectAnchor(page, id);
  }
});

test("Back and Forward restore selected sections with the navigation offset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#about");
  await expectAnchor(page, "about");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  for (const id of ["work", "skills"]) {
    await navigation.locator(`a[href="#${id}"]`).click();
    await expectAnchor(page, id);
  }
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  await expectAnchor(page, "work");
  await page.goForward();
  await expect(page).toHaveURL(/#skills$/);
  await expectAnchor(page, "skills");
});
