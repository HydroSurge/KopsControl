#pragma strict
class Game {
	var gameNumber : int;
	var gameSolution : int[];
	
	function Game(gameNumber : int, gameSolution : Array) {
		this.gameNumber = gameNumber;
		this.gameSolution = gameSolution;
	}
	function getGameSolution() {
		return gameSolution;
	}
	function getGameNumber() {
		return gameNumber;
	}
	function getSolutionLength() {
		return gameSolution.length;
	}
	function isCorrectSolution(userSolution : Array) {
		if(userSolution.length != gameSolution.length) {
			return false;
		}
		for(var i = 0; i < userSolution.length; i++) {
			if(gameSolution[i] != userSolution[i]) {
				return false;
			}
		}
		return true;
	}
}