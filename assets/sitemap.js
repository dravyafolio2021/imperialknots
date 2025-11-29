// assets/sitemap.js
// Simple client-side search, expand/collapse products, toggle show products global
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("sitemap-search");
  const collectionToggle = document.getElementById("sitemap-toggle-products");
  const expandButtons = document.querySelectorAll(".sitemap__expand-products");
  const showProductsGlobally = !!collectionToggle;
  const includeProducts =
    document.querySelectorAll(".sitemap__sublist").length > 0;

  // Focus shortcut: Ctrl+F focuses search input on page
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
      if (input) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    }
  });

  // Simple live filter: matches link text, meta text, small text
  if (input) {
    input.addEventListener("input", function () {
      const q = this.value.trim().toLowerCase();
      const items = document.querySelectorAll(
        ".sitemap__item, .sitemap__subitem"
      );
      if (!q) {
        items.forEach((i) => (i.style.display = ""));
        return;
      }
      items.forEach((item) => {
        const text = (item.innerText || "").toLowerCase();
        if (text.indexOf(q) !== -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
      // also expand any collapsed lists to reveal search hits
      document.querySelectorAll(".sitemap__sublist").forEach((list) => {
        const visibleChild = Array.from(list.children).some(
          (child) => child.style.display !== "none"
        );
        if (visibleChild) list.hidden = false;
      });
    });
  }

  // Expand / collapse individual collection product lists
  expandButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const handle = this.getAttribute("data-collection-handle");
      const list = document.querySelector(
        '.sitemap__sublist[data-collection="' + handle + '"]'
      );
      if (!list) return;
      const isHidden = list.hidden;
      list.hidden = !isHidden;
      this.setAttribute("aria-expanded", isHidden ? "true" : "false");
      this.textContent = isHidden ? "Hide" : "Show";
    });
  });

  // Global toggle: show/hide product lists for all collections
  if (collectionToggle && includeProducts) {
    collectionToggle.addEventListener("click", function () {
      const lists = document.querySelectorAll(".sitemap__sublist");
      const pressed = this.getAttribute("aria-pressed") === "true";
      lists.forEach((l) => (l.hidden = pressed)); // if pressed true => currently visible -> hide
      this.setAttribute("aria-pressed", (!pressed).toString());
      this.textContent = !pressed ? "Hide products" : "Show products";
      // update expand buttons text & aria
      document.querySelectorAll(".sitemap__expand-products").forEach((b) => {
        b.setAttribute("aria-expanded", (!pressed).toString());
        b.textContent = !pressed ? "Hide" : "Show";
      });
    });
  }

  // Progressive enhancement: if JS enabled and search is empty, collapse product lists by default
  if (includeProducts && input && !input.value) {
    document
      .querySelectorAll(".sitemap__sublist")
      .forEach((l) => (l.hidden = true));
    document.querySelectorAll(".sitemap__expand-products").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      b.textContent = "Show";
    });
  }
});
