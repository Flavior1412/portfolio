import { test, expect } from "@playwright/test";
import profileContent from "../../src/features/profile/infrastructure/data/profile.json";
const { profile } = profileContent;

test.describe("Contact links", () => {
  test("offers email and phone contact without a message form", async ({
    page,
  }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();

    const message = contact.getByRole("link", { name: "Send Message" });
    await expect(message).toBeVisible();
    await expect(message).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(
      contact.getByRole("link", { name: "Email", exact: true }),
    ).toHaveAttribute("href", `mailto:${profile.email}`);
    await expect(
      contact.getByRole("link", { name: "Phone", exact: true }),
    ).toHaveAttribute("href", `tel:${profile.phone}`);
    await expect(contact.locator("form")).toHaveCount(0);
  });

  test("does not expose the removed contact API", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "Khuong", email: "khuong@example.com", message: "Hello" },
    });
    expect(response.status()).toBe(404);
  });
});
