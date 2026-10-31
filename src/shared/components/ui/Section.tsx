import type { ComponentPropsWithoutRef } from "react";
import styles from "./Section.module.css";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  variant?: "default" | "sticky" | "interactive";
};

/** Shared section surfaces; spacing and content remain with the caller. */
export function Section({
  variant = "default",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      className={`${styles.root} ${styles[variant]} ${variant === "interactive" ? "group/section" : ""} ${className}`}
      {...props}
    />
  );
}
