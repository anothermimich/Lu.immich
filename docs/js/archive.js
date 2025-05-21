(function () {
  var grid;
  function init() {
    grid = new Minigrid({
      container: ".archive",
      item: ".archive-item",
      gutter: 12,
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
