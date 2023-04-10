window.addEventListener(
  "load",
  function () {
    const $tiles = [...document.querySelectorAll(".playable .tile")];
    const $tile16 = $tiles.find((tile) => tile.classList.contains("tile-16"));
    let isPlaying = true;
    let counter;
    let record = -1;

    startGame();

    function getOrderFromClassName(el) {
      return +el.className
        .split(" ")
        .find((name) => name.includes("tile-"))
        .split("-")[1];
    }

    function getTileOrder(el) {
      return el.style.order !== ""
        ? +el.style.order
        : getOrderFromClassName(el);
    }

    function areTilesAdjacent(order1, order2) {
      const diff = Math.abs(order1 - order2);
      return diff === 1 || diff === 4;
    }

    function didWin() {
      return $tiles.every((tile) => {
        const order = getTileOrder(tile);
        return tile.classList.contains(`tile-${order}`);
      });
    }

    function shuffleTiles() {
      $tiles.sort(() => Math.random() - 0.5);
      $tiles.forEach((tile, i) => (tile.style.order = i + 1));
    }

    function order() {
      $tiles.forEach(
        (tile) => (tile.style.order = getOrderFromClassName(tile))
      );
    }

    function startGame() {
      isPlaying = true;
      counter = 0;
      shuffleTiles();
    }

    // click events
    this.document.addEventListener("click", function ({ target }) {
      if ($tiles.includes(target) && isPlaying && target !== $tile16) {
        const order = getTileOrder(target);
        const order16 = getTileOrder($tile16);
        if (areTilesAdjacent(order, order16)) {
          $tile16.style.order = order;
          target.style.order = order16;
          counter++;

          if (didWin()) {
            // isPlaying = false;
            if (counter < record) {
              record = counter;
            }
            alert("You won!");
          }
        }
      }
    });
  },
  false
);
