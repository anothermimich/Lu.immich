const GUTTER_VALUE = 1;

(function () {
  var grid;
  function init() {
    grid = new Minigrid({
      container: "#archive-item-container-2025",
      item: ".archive-item",
      gutter: GUTTER_VALUE,
      done: function () {
        document.dispatchEvent(new Event("minigrid:layout"));
      },
    });
    grid.mount();
  }

  function update() {
    grid.mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", init);
  window.addEventListener("resize", update);
})();

(function () {
  var grid;
  function init() {
    grid = new Minigrid({
      container: "#archive-item-container-2024",
      item: ".archive-item",
      gutter: GUTTER_VALUE,
      done: function () {
        document.dispatchEvent(new Event("minigrid:layout"));
      },
    });
    grid.mount();
  }

  function update() {
    grid.mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", init);
  window.addEventListener("resize", update);
})();
