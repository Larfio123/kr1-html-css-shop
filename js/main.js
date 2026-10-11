"use strict";

// Открытие и закрытие нативного модального окна.
document.querySelectorAll("[data-open-dialog]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.openDialog);
    if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((trigger) => {
  trigger.addEventListener("click", () => trigger.closest("dialog")?.close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

// Форма только показывает результат проверки и ничего не отправляет.
document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    if (!status) return;
    status.hidden = false;
    status.textContent = "Поля заполнены. Это учебный макет: данные никуда не отправлены.";
  });
});

// Фильтр каталога обновляет карточки и количество товаров в разделах.
const catalogFilters = document.querySelectorAll("[data-catalog-filter]");

if (catalogFilters.length) {
  const categories = document.querySelectorAll(".catalog-category");
  const resultCount = document.querySelector("[data-result-count]");

  const productWord = (count) => {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "товаров";
    if (lastDigit === 1) return "товар";
    if (lastDigit >= 2 && lastDigit <= 4) return "товара";
    return "товаров";
  };

  catalogFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedFilter = filterButton.dataset.catalogFilter;
      let visibleCount = 0;

      categories.forEach((category) => {
        const categoryProducts = category.querySelectorAll("[data-product-availability]");
        let visibleCategoryCount = 0;

        categoryProducts.forEach((product) => {
          const isVisible =
            selectedFilter === "all" || product.dataset.productAvailability === selectedFilter;
          product.hidden = !isVisible;
          if (isVisible) visibleCategoryCount += 1;
        });

        visibleCount += visibleCategoryCount;
        category.hidden = visibleCategoryCount === 0;

        const categoryCount = category.querySelector("[data-category-count]");
        if (categoryCount) {
          categoryCount.textContent =
            `${visibleCategoryCount} ${productWord(visibleCategoryCount)}`;
        }

        const categoryLink = document.querySelector(
          `.catalog-aside__links a[href="#${category.id}"]`
        );
        if (categoryLink) categoryLink.closest("li").hidden = visibleCategoryCount === 0;
      });

      if (resultCount) {
        resultCount.textContent = `Показано ${visibleCount} ${productWord(visibleCount)}`;
      }

      catalogFilters.forEach((button) => {
        const isActive = button === filterButton;
        button.classList.toggle("catalog-filter--active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    });
  });
}
