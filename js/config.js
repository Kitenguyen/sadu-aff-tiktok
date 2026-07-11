export const BREAKPOINTS = Object.freeze({
  mobileSm: 360,
  mobileMd: 375,
  mobileLg: 390,
  mobileXl: 430,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
});

export const UI_CONFIG = Object.freeze({
  tapTargetMin: 44,
  defaultTheme: "dark",
  assetFormats: ["webp", "png", "jpg", "mp4"],
});

// Replace these placeholders when wiring the landing page to real services.
export const INTEGRATION_CONFIG = Object.freeze({
  form: {
    googleAppsScriptUrl:
      "https://script.google.com/macros/s/AKfycbwhHsJ_gwl-YTsrJTR3NrqGJvls3wkkPIRqGrbgEI62B1Lclm2XrMMZNIj7s24zn16anA/exec",
    webhookUrl: "",
    crmEndpoint: "",
    apiEndpoint: "",
  },
  analytics: {
    tiktokPixelId: "",
    ga4MeasurementId: "",
    gtmContainerId: "",
    metaPixelId: "",
  },
});
