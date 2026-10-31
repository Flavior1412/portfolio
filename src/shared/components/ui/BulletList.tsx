import type { ComponentPropsWithoutRef } from "react";
import styles from "./BulletList.module.css";

type BulletListProps = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  items: readonly string[];
  variant?: "default" | "compact";
};

export function BulletList({
  items,
  variant = "default",
  className = "",
  ...props
}: BulletListProps) {
  return (
    <ul className={`${styles[variant]} ${className}`} {...props}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <span aria-hidden="true" className={styles.marker} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
