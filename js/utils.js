export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function supportsNativeLazyLoading() {
  return "loading" in HTMLImageElement.prototype;
}
