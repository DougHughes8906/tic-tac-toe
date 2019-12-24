

/*************************************************************
Player factory function.
*************************************************************/

const Player = (name) => {

	// the header element that is used to print messages
	const header = document.querySelector(".header");

	const printTurn = () => {
		header.textContent = `{name}'s turn`;
	};

	const printWin = () => {
		header.textContent = `{name} has won!`;
	}

	return {printTurn, printWin};
};


/*************************************************************

*************************************************************/










/*************************************************************

*************************************************************/



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
