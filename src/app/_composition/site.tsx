/** Canonical site identity shared by app metadata and server composition. */
export const SITE_URL = (
  process.env.SITE_URL || "https://khuongnh-portfolio.vercel.app"
).replace(/\/+$/, "");
