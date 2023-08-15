window.addEventListener(
  "load",
  function () {
    // DOM elements
    const $tiles = [...document.querySelectorAll(".playable .tile")];
    const $tile16 = $tiles.find((tile) => tile.classList.contains("tile-16"));
    const $restartBtn = document.querySelector(".restart");
    const $solveBtn = document.querySelector(".solve");
    const $undoBtn = document.querySelector(".undo");
    const $redoBtn = document.querySelector(".redo");
    const $counter = document.querySelector(".counter span");
    const $record = document.querySelector(".record span");

    // game variables
    let isPlaying;
    let counter;
    let record;
    let history;
    let historyIndex;

    init();

    // functions

    function init() {
      setRecord(-1);
      newGame();
    }

    function getOrderFromClassName(el) {
      return +el.className
        .split(" ")
        .find((name) => name.includes("tile-"))
        .split("-")[1];
    }

    function getTileOrder($elem) {
      return $elem.style.order !== ""
        ? +$elem.style.order
        : getOrderFromClassName($elem);
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

    function orderTiles() {
      $tiles.forEach(
        (tile) => (tile.style.order = getOrderFromClassName(tile))
      );
    }

    function solve() {
      emptyHistory();
      orderTiles();
      updateHistory();
      setCounter(-1);
    }

    function newGame() {
      if (!isPlaying) isPlaying = true;
      shuffleTiles();
      history = [getTilesOrder()];
      historyIndex = 0;
      setCounter(0);
      setRecord(-1);
    }

    function emptyHistory() {
      history.splice(0);
      historyIndex = -1;
    }

    function setCounter(counter2) {
      counter = counter2;
      updateCounterHtml();
    }

    function setRecord(record2) {
      record = record2;
      updateRecordHtml();
    }

    function onClickTile(target) {
      if (!isPlaying || target === $tile16) return;
      const order = getTileOrder(target);
      const order16 = getTileOrder($tile16);
      if (areTilesAdjacent(order, order16)) {
        $tile16.style.order = order;
        target.style.order = order16;

        updateHistory();
        setCounter((counter === -1 ? 0 : counter) + 1);
        checkWin();
      }
    }

    function updateHistory() {
      history.splice(historyIndex + 1);
      history.push(getTilesOrder());
      historyIndex = history.length - 1;
    }

    function updateCounterHtml() {
      $counter.textContent = counter === -1 ? "-" : counter;
    }

    function updateRecordHtml() {
      $record.textContent = record === -1 ? "-" : record;
    }

    function checkWin() {
      if (!didWin()) return;

      isPlaying = false;
      const newRecord = checkNewRecord();
      setTimeout(() => {
        alert(`You won! ${newRecord ? `New record! ${record}` : ""}`);
      }, 0);
    }

    function checkNewRecord() {
      if (record === -1 || counter < record) {
        setRecord(counter);
        return true;
      }
      return false;
    }

    function getTilesOrder() {
      return $tiles.map(($tile) => getTileOrder($tile));
    }

    function loadHistoryItem() {
      const historyItem = history[historyIndex];
      if (historyItem === undefined) {
        console.log("historyItem is undefined");
        return;
      }
      $tiles.forEach(($tile, i) => {
        $tile.style.order = historyItem[i];
      });
    }

    function undo() {
      if (historyIndex === 0) return;
      historyIndex--;
      loadHistoryItem();
      setCounter(counter - 1);
    }

    function redo() {
      if (historyIndex === history.length - 1) return;
      historyIndex++;
      loadHistoryItem();
      setCounter(counter + 1);
    }

    function parentEquals($elem, $parent) {
      while ($elem !== $parent && $elem !== null) {
        $elem = $elem.parentElement;
      }
      return $elem === $parent;
    }

    // click events
    this.document.addEventListener("click", function ({ target }) {
      if ($tiles.includes(target)) {
        onClickTile(target);
      } else if (parentEquals(target, $restartBtn)) {
        newGame();
      } else if (parentEquals(target, $solveBtn)) {
        solve();
      } else if (parentEquals(target, $undoBtn)) {
        undo();
      } else if (parentEquals(target, $redoBtn)) {
        redo();
      }
    });
  },
  false
);
