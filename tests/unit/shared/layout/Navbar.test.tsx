import { Navbar } from "@/shared/components/layout/Navbar";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Navbar", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("closes when its open trigger is clicked rather than reopening on mousedown", () => {
    render(<Navbar name="Test User" email="test@example.com" />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.mouseDown(trigger);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
  });

  it("closes with Escape and restores focus to the trigger", () => {
    render(<Navbar name="Test User" email="test@example.com" />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    fireEvent.click(trigger);
    const menu = document.getElementById("mobile-menu")!;
    within(menu).getByRole("link", { name: "Timeline" }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on an outside click and on a navigation selection", () => {
    render(<Navbar name="Test User" email="test@example.com" />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    fireEvent.click(
      within(document.getElementById("mobile-menu")!).getByRole("link", {
        name: "Skills",
      }),
    );
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
