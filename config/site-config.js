// Central site-level configuration for future deployment wiring.
// This file is not required by the current UI runtime yet, but keeps
// production values in one predictable place for handoff and integration.

export const siteConfig = Object.freeze({
  brand: {
    name: "SADU Creator",
    title: "SADU Affiliate Creator Program",
    description:
      "Landing Page tuyển TikTok Affiliate Creator cho thương hiệu SADU.",
    language: "vi",
    locale: "vi_VN",
  },
  seo: {
    canonicalUrl: "https://example.com/sadu-affiliate-creator",
    ogImage: "./assets/images/og-placeholder.jpg",
    twitterImage: "./assets/images/og-placeholder.jpg",
    themeColor: "#0b0d12",
  },
  assets: {
    favicon: "./assets/icons/favicon-placeholder.svg",
    logo: "",
    heroVideo: "",
  },
  integrations: {
    googleAppsScriptUrl:
      "https://script.google.com/macros/s/AKfycbwhHsJ_gwl-YTsrJTR3NrqGJvls3wkkPIRqGrbgEI62B1Lclm2XrMMZNIj7s24zn16anA/exec",
    webhookUrl: "",
    crmEndpoint: "",
    apiEndpoint: "",
    tiktokPixelId: "",
    ga4MeasurementId: "",
    gtmContainerId: "",
    metaPixelId: "",
  },
});
