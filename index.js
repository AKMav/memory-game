const cards = document.querySelectorAll(".main__card-body");
const today = new Date();
const btnTable = document.querySelector('.header__show-table');
const scoreObj = {};
const table = document.querySelector('.table');
const columns = document.querySelectorAll('.col');
const col1 = document.querySelector('.col-1');
const col2 = document.querySelector('.col-2');
const col3 = document.querySelector('.col-3');



const gameData = {
	user: 'Игрок',
	score: 0,
	gameNumber: 1,
	date: [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), today.getMinutes()],
}

if (localStorage.getItem('gameNumber')) {
	gameData.gameNumber = +localStorage.getItem('gameNumber') + 1;
}

let hasChosenCard = false;
let block = false;
let firstCard, secondCard;
const inputContainer = document.createElement('div');
const inputUserName = document.createElement('input');
const inputHeader = document.createElement('span');
inputHeader.innerText = 'Назови своё имя';
inputUserName.type = 'text';
inputUserName.maxLength = 16;
inputUserName.value = gameData.user;
inputUserName.classList.add('input-name');
inputContainer.classList.add('input-container');
inputHeader.classList.add('input-header');
document.querySelector('.wrapper').append(inputContainer);
inputContainer.append(inputHeader);
inputContainer.append(inputUserName);
inputUserName.focus();
inputUserName.addEventListener('keyup', hasName);

cards.forEach(card => card.addEventListener('click', flipCard));
btnTable.addEventListener('click', getTable);
btnTable.addEventListener('click', showTable);

function hasName(event) {
	if (event.code === 'Enter') {
		if (inputUserName.value) {
			gameData.user = inputUserName.value;
			inputContainer.remove();
		} else {
			inputHeader.innerText = 'Нет имени - нет игры!';
		}
	}
}

function getFullDate(date) {
	let str = '';
	date.forEach((elem) => {
		if (elem < 10) {
			elem = '0' + elem;
		}
		if (elem === today.getHours() || elem === today.getMinutes()) {
			str = str + elem + ':';
		} else {
			str += elem + '-';
		}
	})
	return str.slice(0, -1);
}

function flipCard() {
	if (block) return;
	if (this === firstCard) return;

	this.classList.add('flip');

	if (!hasChosenCard) {
		hasChosenCard = true;
		firstCard = this;
		return;
	}

	secondCard = this;
	block = true;

	checkMatch();
	isWin();
}


function isWin() {
	if (Array.from(cards).every(elem => elem.classList.contains('flip'))) {
		setTimeout(function () {
			if (gameData.gameNumber < 10) {
				setLocalStorage();
				unflipBoard();
				gameData.score = 0;
				gameData.gameNumber++;
			} else {
				gameData.gameNumber = 1;
				setLocalStorage();
				unflipBoard();
				gameData.score = 0;
			}
		}, 1000)
	}
}

function checkMatch() {
	gameData.score++;
	if (firstCard.dataset.hero === secondCard.dataset.hero) {
		disableCards();
		resetBoard();
		return;
	}
	unflipCards();
}

function disableCards() {
	firstCard.removeEventListener('click', flipCard);
	secondCard.removeEventListener('click', flipCard);
}

function unflipCards() {
	setTimeout(() => {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');
		resetBoard();
	}, 1000)
}

function unflipBoard() {
	cards.forEach(card => card.addEventListener('click', flipCard));
	document.querySelectorAll('.flip').forEach(elem => {
		elem.classList.remove('flip')
	});
}

function resetBoard() {
	[hasChosenCard, block] = [false, false];
	[firstCard, secondCard] = [null, null];
}

function letRandom() {
	cards.forEach(card => {
		let randomPosition = Math.floor(Math.random() * 12);
		card.style.order = randomPosition;
	})
}

function setLocalStorage() {
	localStorage.setItem(`${gameData.gameNumber}`, [gameData.score, gameData.user, (getFullDate(gameData.date))].join(`,`));
	localStorage.setItem('gameNumber', gameData.gameNumber);
}

function getTable() {
	console.log(gameData.gameNumber)
	columns.forEach(elem => {
		elem.innerText = '';
	})
	col1.innerText = 'Количество ходов';
	col2.innerText = 'Имя игрока';
	col3.innerText = 'Время игры';

	for (let i = 10; i > 0; i--) {
		if (localStorage.getItem(i)) {
			scoreObj[i] = localStorage.getItem(i).split(',');
		}
	}
	Object.keys(scoreObj).forEach(key => {
		for (let j = 0; j < columns.length; j++) {
			columns[j].innerHTML += "<br>" + scoreObj[key][j];
		}
	})
}

function showTable() {
	table.classList.toggle('hdn');
	if (!table.classList.contains('hdn')) {
		btnTable.innerText = 'Скрыть таблицу';
	} else {
		btnTable.innerText = 'Таблица рекордов';
	}
}


// letRandom();
