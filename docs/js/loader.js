// Wait for the DOM to be fully loaded
// document.addEventListener("DOMContentLoaded", function () {
//   // Reference to the loader element
//   const loader = document.querySelector(".loader");
//   let loaderHidden = false; // flag to prevent multiple hides

//   // Listen for the custom event from minigrid
//   document.addEventListener("minigrid:layout", function () {
//     if (loader && !loaderHidden) {
//       loader.style.display = "none";
//       loaderHidden = true;
//     }
//   });

//   // Fallback: Use MutationObserver to detect layout changes (optional)
//   const gridContainer = document.querySelector(".archive-sheets-container");
//   if (gridContainer && loader) {
//     const observer = new MutationObserver(() => {
//       if (!loaderHidden) {
//         loader.style.display = "none";
//         loaderHidden = true;
//         observer.disconnect();
//       }
//     });
//     observer.observe(gridContainer, { childList: true, subtree: true });
//   }
// });
document.addEventListener("DOMContentLoaded", function () {
  // Reference to the loader element
  const loader = document.querySelector(".loader");
  let loaderHidden = false; // flag to prevent multiple hides

  // Disable pointer events on archive tag links while loader is visible
  const archiveTagLinks = document.querySelectorAll(".archive-tag-container");
  archiveTagLinks.forEach((link) => {
    // link.style.pointerEvents = "none";
  });

  function enableLinks() {
    archiveTagLinks.forEach((link) => {
      link.style.pointerEvents = "";
      link.style.opacity = ""; // reset opacity
    });
  }

  // Listen for the custom event from minigrid
  document.addEventListener("minigrid:layout", function () {
    if (loader && !loaderHidden) {
      loader.style.display = "none";
      loaderHidden = true;
      enableLinks();
    }
  });

  // Fallback: Use MutationObserver to detect layout changes (optional)
  const gridContainer = document.querySelector(".archive-sheets-container");
  if (gridContainer && loader) {
    const observer = new MutationObserver(() => {
      if (!loaderHidden) {
        loader.style.display = "none";
        loaderHidden = true;
        enableLinks();
        observer.disconnect();
      }
    });
    observer.observe(gridContainer, { childList: true, subtree: true });
  }
});
