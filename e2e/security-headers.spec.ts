import { test, expect } from "@playwright/test";

const routes = ["/", "/menu", "/our-story", "/visit"];

test.describe("security headers (§4)", () => {
  for (const route of routes) {
    test(`${route}: mengirim header keamanan dasar`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(200);

      const headers = response.headers();
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect(headers["cross-origin-resource-policy"]).toBe("same-origin");

      const csp = headers["content-security-policy"] ?? "";
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");

      expect(headers["permissions-policy"] ?? "").toContain("geolocation=()");
      expect(headers["strict-transport-security"]).toBe("max-age=31536000");

      // Jangan bocorkan versi framework.
      expect(headers["x-powered-by"]).toBeUndefined();
    });
  }
});
