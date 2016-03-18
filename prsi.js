function game() {
  this.playerNames = [];
  this.players = [];
  this.deck = new deck(this);

  this.startGame = function() {

    // You can't start the game without the players
    if (this.playerNames == []){
      return false;
    }

    // It gives each player new hand
    for (var i = 0; i < this.playerNames.length; i++) {
      this.players.push(new hand(this.deck, this.playerNames[i]));
    }

    // It starts a new deck
    this.deck.newDeck();

    // Init lastCardPlayed
    var lastCardPlayed = this.deck.giveCard()
    this.lastCardPlayed = lastCardPlayed;
    this.deck.usedCards.push(lastCardPlayed);

    // It gives each player 4 cards
    for (var i = 0; i < this.players.length; i++) {
      for (var a = 0; a < 4; a++){
        this.players[i].addCard();
      }
    }

    // It starts a turn for player 1
    this.turn = this.players[0];

    return true;
  }
}

function hand(deck, playerName){
  this.deck = deck;
  this.playerName = playerName;
  this.cards = [];
  this.sevenOnMe = false;
  // Card 7
  this.cardsToDraw = 0;

  this.addCard = function() {
    this.cards.push(this.deck.giveCard());
    var cardHandChanger = this.cards[this.cards.length - 1];
    cardHandChanger.hand = this;
  }

  this.drawCard = function() {

    // If it's not your turn
    if (this != this.deck.game.turn) {
      return false;
    }

    this.addCard();

    // Sets up the turn for the next player
    var indexOfThisPlayer = this.deck.game.players.indexOf(this);
    var indexOfFuturePlayer = indexOfThisPlayer + 1;

    if (typeof this.deck.game.players[indexOfFuturePlayer] == 'undefined'){
      indexOfFuturePlayer = 0;
    }

    if (card.skipTurn == true) {
      indexOfFuturePlayer++;

      if (typeof this.deck.game.players[indexOfFuturePlayer] == 'undefined'){
        indexOfFuturePlayer = 0;
      }
    }

    this.deck.game.turn = this.deck.game.players[indexOfFuturePlayer];

    return true;
  }

  this.playCard = function(card, color) {

    // If it's not your turn
    if (this != this.deck.game.turn) {
      return false;
    }

    // If you are allowed to play this card
    if (this.deck.game.lastCardPlayed == undefined || this.deck.game.lastCardPlayed.color == card.color || this.deck.game.lastCardPlayed.value == card.value || card.value == "ober") {
      // Removes the card from the hand
      var cardIndex = this.cards.indexOf(card);
      this.cards.splice(cardIndex, 1);
      // Adds the card to usedCards
      this.deck.usedCards.push(card);
      // Sets up the rules to play next card
      this.deck.game.lastCardPlayed = card;
      // Uses it's ability
      card.ability(color);
      // Removes the owner of the card
      card.hand = undefined;

      // Sets up the turn for the next player
      var indexOfThisPlayer = this.deck.game.players.indexOf(this);
      var indexOfFuturePlayer = indexOfThisPlayer + 1;

      if (typeof this.deck.game.players[indexOfFuturePlayer] == 'undefined'){
        indexOfFuturePlayer = 0;
      }

      if (card.skipTurn == true) {
        indexOfFuturePlayer++;

        if (typeof this.deck.game.players[indexOfFuturePlayer] == 'undefined'){
          indexOfFuturePlayer = 0;
        }
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
    case "ace":
      this.ability = function() {
        // Player that would play next, can't play
        this.skipTurn = true;
      }
      break;

    case "ober":
      this.ability = function(color) {
        this.deck.game.lastCardPlayed.color = color;
      }
      break;

    case "7":
      this.ability = function() {
        var owner =  this.hand;
        var players = this.deck.game.players;
        var indexOfOwner = players.indexOf(owner);
        var nextPlayerIndex = indexOfOwner + 1;

        if (typeof players[nextPlayerIndex] == 'undefined') {
          nextPlayerIndex = 0;
        }

        var nextPlayer = players[nextPlayerIndex];
        nextPlayer.cardsToDraw = owner.cardsToDraw + 2;
        owner.cardsToDraw = 0;
      }
      break;

    default:
      this.ability = function() {
      }
  }
}

function deck(game) {
  this.cards = [];
  this.usedCards = [];
  this.lastCard = undefined;
  this.game = game;

  // Returns a card that has been deleted from deck.cards
  this.giveCard = function() {
    var topDeckCard = this.cards[0];
    this.cards.shift();
    return topDeckCard;
  }

  this.recycleDeck = function() {
    var lastCard = this.usedCards[this.usedCards.length - 1];

    // Removes lastCard from usedCards array
    this.usedCards.splice(lastCard - 1, 1)
    this.cards = shuffle(this.usedCards);
    this.usedCards = [lastCard];

    // Sets lastCard as lastCardPlayed (it's not necessary I guess :D)
    this.game.lastCardPlayed = lastCard;
  }

  this.newDeck = function() {

    // Resets used cards and new cards
    this.usedCards = [];
    this.cards = [
      new card("heart", "7", this),
      new card("bell", "7", this),
      new card("leaf", "7", this),
      new card("acorn", "7", this),
      new card("heart", "8", this),
      new card("bell", "8", this),
      new card("leaf", "8", this),
      new card("acorn", "8", this),
      new card("heart", "9", this),
      new card("bell", "9", this),
      new card("leaf", "9", this),
      new card("acorn", "9", this),
      new card("heart", "10", this),
      new card("bell", "10", this),
      new card("leaf", "10", this),
      new card("acorn", "10", this),
      new card("heart", "unter", this),
      new card("bell", "unter", this),
      new card("leaf", "unter", this),
      new card("acorn", "unter", this),
      new card("heart", "ober", this),
      new card("bell", "ober", this),
      new card("leaf", "ober", this),
      new card("acorn", "ober", this),
      new card("heart", "king", this),
      new card("bell", "king", this),
      new card("leaf", "king", this),
      new card("acorn", "king", this),
      new card("heart", "ace", this),
      new card("bell", "ace", this),
      new card("leaf", "ace", this),
      new card("acorn", "ace", this),
    ];

    // Shuffles new cards
    this.cards = shuffle(this.cards);
  }
}

// Shuffle function

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
