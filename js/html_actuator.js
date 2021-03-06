function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  // this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.modalContainer   = document.getElementById("modal");
  this.fadeContainer    = document.getElementById("fade");
  this.loadingContainer = document.getElementById("loading");
  this.resultContainer = document.getElementById("show-message");

  this.score = 0;

} 

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    // self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.playAgain();
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

// HTMLActuator.prototype.updateBestScore = function (bestScore) {
//   this.bestContainer.textContent = bestScore;
// };

HTMLActuator.prototype.message = function (won) {
  // var type    = won ? "game-won" : "game-over";
  var type    =  "game-won";
  var message =  "Game Over!"

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.messageModified = function(won, score) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!\nScore on Blockchain is " + score : "You lost!\nScore on Blockchain is " + score;

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
}

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.openModal = function () {
  this.modalContainer.getElementsByTagName("input")[0].value = window.localStorage.getItem("token")? JSON.parse(window.localStorage.getItem("token")).username : JSON.parse(window.localStorage.getItem("user")).username;
  this.modalContainer.getElementsByTagName("input")[1].value = window.localStorage.getItem("token")? JSON.parse(window.localStorage.getItem("token")).accountAddress : JSON.parse(window.localStorage.getItem("user")).address;
  this.modalContainer.getElementsByTagName("input")[2].value = "";
  this.fadeContainer.style.display = "block";
  this.fadeContainer.style.disp2ay = "block";
  this.modalContainer.style.display = "block";
} 

HTMLActuator.prototype.closeModal = function () {
  this.fadeContainer.style.display = "none";
  this.modalContainer.style.display = "none";
}

HTMLActuator.prototype.openLoading = function () {
  this.modalContainer.style.display = "none";
  this.fadeContainer.style.display = "block";
  this.loadingContainer.style.display = "block";
}

HTMLActuator.prototype.closeLoading = function () {
  this.modalContainer.style.display = "none";
  this.fadeContainer.style.display = "block";
  this.loadingContainer.style.display = "none";
  this.resultContainer.style.display = "block";
}

HTMLActuator.prototype.setMessage = function (text) {
  this.resultContainer.getElementsByTagName("p")[0].textContent = text;
}

HTMLActuator.prototype.playAgain = function () {
  this.fadeContainer.style.display = "none";
  this.resultContainer.style.display = "none";
}
