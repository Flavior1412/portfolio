import { test, expect } from "@playwright/test";

test.describe("Contact links", () => {
  test("offers email and phone contact plus external profile links", async ({
    page,
  }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();

    const zalo = contact.getByRole("link", { name: "Zalo" });
    await expect(zalo).toBeVisible();
    await expect(zalo).toHaveAttribute("href", "https://zalo.me/0354342144");
    await expect(
      contact.getByRole("link", { name: "LinkedIn", exact: true }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/h%E1%BB%AFu-kh%C6%B0%C6%A1ng-kira-2a6431191/",
    );
    await expect(
      contact.getByRole("link", { name: "Resume", exact: true }),
    ).toHaveAttribute(
      "href",
      "/resume/Khuong%20CV_281026.pdf",
    );
    await expect(contact.locator("form")).toHaveCount(0);
  });

  test("does not expose the removed contact API", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "Khuong", email: "khuong@example.com", message: "Hello" },
    });
    expect(response.status()).toBe(404);
  });
});
