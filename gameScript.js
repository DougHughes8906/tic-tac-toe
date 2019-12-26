

/*************************************************************
Player factory function.
*************************************************************/

const Player = (name) => {

	// the header element that is used to print messages
	const header = document.querySelector(".header");

	const printTurn = () => {
		header.textContent = `${name}'s turn`;
	};

	const printWin = () => {
		header.textContent = `${name} has won!`;
	}

	return {printTurn, printWin};
};


/*************************************************************
Game board module. Controls the state of the board, and 
writes X's and O's to the board based on user actions.
*************************************************************/

const gameBoard = (() => {
	// constant values representing the various game states	
	const _X_WIN = 1;
	const _O_WIN = 2;
	const _TIE = 3;
	const _X_TURN = 4;
	const _O_TURN = 5;
	
	// holds a value representing the current game state 
	let _gameState = _X_TURN;	
	// holds the number of squares currently filled by either X's or O's
	let _filledCount = 0;

	// stores the state of the grid:
	//	- "" if square is empty
	// 	- "X" if square is occupied by an X
	//	- "O" if square is occupied by an O
	const _squareStates = [];
	const _NUM_SQUARES = 9;
	for (let i = 0; i < _NUM_SQUARES; i++) {
		_squareStates.push("");
	}

	// the board element and each of the individual square elements	
	const _board = document.querySelector("#board");
	const _boardNodes = _board.childNodes;
	// will hold only the actual board square elements
	const _squareElems = [];
	for (let i = 0; i < _boardNodes.length; i++ ) {
		let node = _boardNodes[i];
		if (node.nodeType == Node.ELEMENT_NODE) {
			_squareElems.push(node);
		}
	}

	// each of the h2s associated with the squares
	const _sqTextNodes = [];
	for (let i = 0; i < _NUM_SQUARES; i++) {
		_sqTextNodes.push(_squareElems[i].childNodes[0]);	
	}

	// processes a click on a square of a given index. Places a 
	// symbol on that square if it is not already occupied.
	function _processClick(index) {
		// only do something if the square isn't already filled and
		// game isn't over
		console.log("Hit");
		let squareVal = _sqTextNodes[index].textContent;
		if (squareVal === "" && (_gameState === _X_TURN || 
			_gameState === _O_TURN)) {
			if (_gameState === _X_TURN) {
				_sqTextNodes[index].textContent = "X";
				_squareStates[index] = "X";	
				_gameState = _O_TURN;	
			}
			else {
				_sqTextNodes[index].textContent = "O";
				_squareStates[index] = "O";
				_gameState = _X_TURN;
			}
			_filledCount++;
			// update the game state if the game is over
			checkState();	
		}	
	}	

	// initializes the listening activity of the game board
	const initialize = () => {
		console.log(_squareElems.length);
		for (let i = 0; i < _NUM_SQUARES; i++) {
			_squareElems[i].addEventListener("click", function() {
				_processClick(i);
			});
		}
	};	

	// Checks the and returns the game's status.  	
	// 	- 1 for X win
	//	- 2 for O win
	// 	- 3 for tie
	// 	-	4 for X's turn (game still active)
	//	- 5 for O's turn (game still active)
	const checkState = () => {
		// if the game is aleady over, return the game state value
		if (_gameState !== _X_TURN && _gameState !== _O_TURN) {
			return _gameState;
		}
	
		let winValue = "";
		// check every row for a win
		if (_squareStates[0] !== "" && 
			_squareStates[0] === _squareStates[1] &&
			_squareStates[0] === _squareStates[2]) {
			winValue = _squareStates[0]	
		}
		else if (_squareStates[3] !== "" &&
			_squareStates[3] === _squareStates[4] &&
			_squareStates[3] === _squareStates[5]) {
			winValue = _squareStates[3]	
		}
		else if (_squareStates[6] !== "" && 
			_squareStates[6] === _squareStates[7] &&
			_squareStates[6] === _squareStates[8]) {
			winValue = _squareStates[6]	
		}	
		// check every column for a win
		else if (_squareStates[0] !== "" &&
			_squareStates[0] === _squareStates[3] &&
			_squareStates[0] === _squareStates[6]) {
			winValue = _squareStates[0]	
		}	
		else if (_squareStates[1] !== "" &&
			_squareStates[1] === _squareStates[4] &&
			_squareStates[1] === _squareStates[7]) {
			winValue = _squareStates[1]	
		}
		else if (_squareStates[2] !== "" &&
			_squareStates[2] === _squareStates[5] &&
			_squareStates[2] === _squareStates[8]) {
			winValue = _squareStates[2]	
		}
		// check each diagonal for win
		else if (_squareStates[0] !== "" && 
			_squareStates[0] === _squareStates[4] &&
			_squareStates[0] === _squareStates[8]) {
			winValue = _squareStates[0]	
		}
		else if (_squareStates[2] !== "" && 
			_squareStates[2] === _squareStates[4] &&
			_squareStates[2] === _squareStates[6]) {
			winValue = _squareStates[2]	
		}

		if (winValue === "X") {
			_gameState = _X_WIN;	
		}
		else if (winValue === "O") {
			_gameState = _O_WIN;	
		}
		else if (_filledCount === _NUM_SQUARES) {
			_gameState = _TIE;
		}

		return _gameState;
	};

	// resets the gameboard to be blank
	const reset = () => {
		_gameState = _X_TURN;		
		_filledCount = 0;
	
		for (let i = 0; i < _NUM_SQUARES; i++) {
			_sqTextNodes[i].textContent = "";
			_squareStates[i] = "";			
		}
	};
	
	return { initialize, checkState, reset };	
})();


/*************************************************************
The game module. After it is started, it controls, runs and
restarts tic tac toe games. 
*************************************************************/

const game = (() => {

	// will refer to each of the Player objects
	// Player 1 is meant to use X's and Player 2 O's
	let _player1 = null;
	let _player2 = null;
	// holds true if it is player one's turn
	let _player1Turn = true;
	// tracks if a game is currently active (i.e. not on a win screen)
	let _gameActive = true;
	// references the game board element
	const _boardElem = document.querySelector("#board");
	// button that will be used to start new games
	const _restartBtn = document.createElement("BUTTON");
	_restartBtn.textContent = "Restart";
	// div in which the restart button is placed
	const _footerDiv = document.querySelector(".footer");


	// function that is used to start new games
	const _startNew = () => {
		gameBoard.reset();
		_player1Turn = true;
		_player1.printTurn();
		_gameActive = true;	
		// remove the restart button and its event listener
		_restartBtn.removeEventListener("click", _startNew);
		_footerDiv.removeChild(_restartBtn);
	};	

	// the header element that is used to print messages
	const header = document.querySelector(".header");
	// prints a message in the header indicating there was a tie
	const _printTie = () => {
		header.textContent = "It's a Tie!";
	};

	// constants associated with the game states returned by 
	// gameBoard.checkState()
	const _X_WIN = 1;
	const _O_WIN = 2;
	const _TIE = 3;
	const _X_TURN = 4;
	const _O_TURN = 5;

	const _updateGame = () => {
		// do nothing if the game is already over
		if (_gameActive) {
			// get the current status
			const curStatus = gameBoard.checkState();
			if (curStatus === _X_TURN) {
				// only update if the turn actually changed
				if (!_player1Turn) {
					_player1Turn = true;
					_player1.printTurn();				
				}
			}	
			else if (curStatus === _O_TURN) {
				if (_player1Turn) {
					_player1Turn = false;
					_player2.printTurn();
				}
			}
			else {
				if (curStatus === _TIE) {	
					_printTie();
				}
				else if (curStatus === _O_WIN) {	
					_player2.printWin();
				}
				else {
					_player1.printWin();
				}
				_gameActive = false;
				_addRestart();
			}
		}	
	};

	// adds the restart button and its event listener to the game screen
	const _addRestart = () => {
		_footerDiv.appendChild(_restartBtn);
		_restartBtn.addEventListener("click", _startNew); 
	};

	const start = () => {
		gameBoard.initialize();
		_player1 = Player("Player 1");
		_player2 = Player("Player 2");
		_player1.printTurn();
		_boardElem.addEventListener("click", function() {
			_updateGame();
		});
	};

	return { start };
})();

/*************************************************************
This portion of the code listens for the start button click
and then initiates the game.
*************************************************************/

// button used to start the game
const startBtn = document.querySelector("#startScreen > button");

// reference to the start screen element
const startScreen = document.querySelector("#startScreen");

// listener to start the game once the start game button is clicked
startBtn.addEventListener("click", function() {
	startScreen.style.display = "none";
	game.start();	
});
