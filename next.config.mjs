/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow an isolated verification build alongside a running local preview.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            // Static portfolio tradeoff: Next App Router emits inline bootstrap scripts.
            // No user content is rendered as scripts; nonce middleware can tighten this later.
            // Only development HMR requires unsafe-eval.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "connect-src 'self'" + (process.env.NODE_ENV === "development" ? " ws: wss:" : ""),
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "worker-src blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
