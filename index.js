const cards = document.querySelectorAll(".main__card-body");
let hasChosenCard = false;
let block = false;
let firstCard, secondCard;

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
}

function checkMatch() {
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
	}, 1500)
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

letRandom();
cards.forEach(card => card.addEventListener('click', flipCard));
