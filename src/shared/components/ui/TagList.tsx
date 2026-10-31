import type { ComponentPropsWithoutRef } from "react";
import styles from "./TagList.module.css";

type TagListProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  items: readonly string[];
  variant?: "default" | "compact";
};

export function TagList({
  items,
  variant = "default",
  className = "",
  ...props
}: TagListProps) {
  return (
    <ul className={`${styles.root} ${styles[variant]} ${className}`} {...props}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
