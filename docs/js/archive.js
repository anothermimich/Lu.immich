(function () {
  var grid;
  function init() {
    grid = new Minigrid({
      container: "#archive-item-container-2025",
      item: ".archive-item",
      gutter: 32,
    });
    grid.mount();
  }

  // mount
  function update() {
    grid.mount();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("resize", update);
})();

(function () {
  var grid;
  function init() {
    grid = new Minigrid({
      container: "#archive-item-container-2024",
      item: ".archive-item",
      gutter: 32,
    });
    grid.mount();
  }

  // mount
  function update() {
    grid.mount();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("resize", update);
})();
