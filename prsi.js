var hra = new game(["Petr", "Osvald"]);
hra.startGame();
var karta = hra.players[0].cards[0]

function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

// While there remain elements to shuffle...
while (0 !== currentIndex) {

  // Pick a remaining element...
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;

  // And swap it with the current element.
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
}

return array;
}









function game(playerNames) {
  this.lastCardPlayed = undefined;
  this.playerNames = playerNames;
  this.players = [];
  this.deck = new deck(this);

  for (var i = 0; i < this.playerNames.length; i++) {
    this.players.push(new hand(this.deck, this.playerNames[i]));
  }

  this.turn = this.players[0];

  this.startGame = function() {
    this.deck.newDeck();
    for (var i = 0; i < this.players.length; i++) {
      for (var a = 0; a < 4; a++){
        this.players[i].addCard();
      }
    }
  }

}

function hand(deck, playerName){
  this.deck = deck;
  this.playerName = playerName;
  this.cards = [];

  this.addCard = function() {
    this.cards.push(this.deck.giveCard());
  }

  this.playCard = function(card) {

    // If it's not your turn
    if (this != this.deck.game.turn) {
      return false;
    }

    // If you are allowed to play this card
    if (this.deck.game.lastCardPlayed == undefined || this.deck.game.lastCardPlayed.color == card.color || this.deck.game.lastCardPlayed.value == card.value) {
      // Removes the card from the hand
      var cardIndex = this.cards.indexOf(card);
      this.cards.splice(cardIndex, 1);
      // Uses it's ability
      card.ability();
      // Adds the card to usedCards
      this.deck.usedCards.push(card);
      // Sets up the rules to play next card
      this.deck.game.lastCardPlayed = card;

      // Sets up the turn for the next player
      var indexOfThisPlayer = this.deck.game.players.indexOf(this);
      var indexOfFuturePlayer = indexOfThisPlayer + 1;

      if (typeof this.deck.game.players[indexOfFuturePlayer] == 'undefined'){
        indexOfFuturePlayer = 0;
      }

      this.deck.game.turn = this.deck.game.players[indexOfFuturePlayer];

      return true;
    }

    // If you are not allowed to play this card
    else {
      return false;
    }
  }
}

function card(color, value, deck) {
  this.color = color;
  this.value = value;
  this.deck = deck;
  this.hand = undefined;
  this.image = color+"_"+value+".png";

  switch (this.value) {
    case "eso":
      this.ability = function() {

        // It's eso, player can play another card
      }
      break;

    case "top":
      this.ability = function() {

      }
      break;

    case "7":
      this.ability = function() { //lizne si 2x
        this.cards.push(this.deck.giveCard());
        this.cards.push(this.deck.giveCard());
      }
      break;

    default:
      this.ability = function() {
        // Sets the rules to play next card
        this.deck.game.lastCardPlayed = this;
      }
  }
}

function deck(game) {
  this.cards = [];
  this.usedCards = [];
  this.lastCard = undefined;
  this.game = game;

  this.giveCard = function() {
    var topDeckCard = this.cards[0];
    this.cards.shift();
    return topDeckCard;
  }

  this.newDeck = function() {

    // Resets used cards and new cards
    this.usedCards = [];
    this.cards = [
      new card("red", "7", this),
      new card("balls", "7", this),
      new card("green", "7", this),
      new card("acorn", "7", this),
      new card("red", "8", this),
      new card("balls", "8", this),
      new card("green", "8", this),
      new card("acorn", "8", this),
      new card("red", "9", this),
      new card("balls", "9", this),
      new card("green", "9", this),
      new card("acorn", "9", this),
      new card("red", "10", this),
      new card("balls", "10", this),
      new card("green", "10", this),
      new card("acorn", "10", this),
      new card("red", "bottom", this),
      new card("balls", "bottom", this),
      new card("green", "bottom", this),
      new card("acorn", "bottom", this),
      new card("red", "top", this),
      new card("balls", "top", this),
      new card("green", "top", this),
      new card("acorn", "top", this),
      new card("red", "king", this),
      new card("balls", "king", this),
      new card("green", "king", this),
      new card("acorn", "king", this),
      new card("red", "eso", this),
      new card("balls", "eso", this),
      new card("green", "eso", this),
      new card("acorn", "eso", this),
    ];

    // Shuffles new cards
    this.cards = shuffle(this.cards);
  }
}
