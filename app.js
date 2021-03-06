var hra = new game();

$(".newGame").click(function() {
  hra = new game();
  $("#addPlayerButton").prop('disabled', false);
  $("#addPlayer input").prop('disabled', false);
  $("#startGameButton").prop('disabled', false);
  $("#playerWon").css("display", "none");
  $(".playerWonBackground").css("display", "none");
  updateGame();
});

$("#addPlayerButton").click(function() {
  var name = $(".addPlayer input").val();

    if (name.length == 0){
      alert("Please set the name for the player");
    }

    else {
      hra.playerNames.push(name);
      updateGame();
      $(".addPlayer input").val("");
    }
});

$("#startGameButton").click(function() {
  if (hra.playerNames.length < 2){
    alert("Add more players");
  }

  else {
    hra.startGame();
    $("#addPlayerButton").prop('disabled', true);
    $(".addPlayer input").prop('disabled', true);
    $("#startGameButton").prop('disabled', true);
    updateGame();
  }
});

function updateGame() {

  // It resets #userPanel
  $( "#players" ).html("");

  // It updates each player
  for (var x = 0; x < hra.playerNames.length; x++) {

    var playerName = hra.playerNames[x];

    // If the game hasn't started yet
    if (hra.players.length == 0){
      $("#players").append('<div class="box player"><div class="label"><span>'+playerName+'</span></div></div>');
    }

    // If the game has started
    else {

      // Getting index of current hand in game.players array
      var indexOfCurrentPlayer = undefined;

      for (var i = 0; i < hra.players.length; i++) {
        if (hra.players[i].playerName == playerName){
          indexOfCurrentPlayer = i;
        }
      }

      // Creating an array of cards that player has in his hand
      var cards = [];

      for (var i = 0; i < hra.players[indexOfCurrentPlayer].cards.length; i++) {
        cards.push(hra.players[indexOfCurrentPlayer].cards[i]);
      }

      var cardsHtml = "";

      // If player has no cards, he won!
      if (cards.length == 0) {
        $("#playerWon").css("display", "block");
        $(".playerWonBackground").css("display", "block");
        $("#playerWon h1").text(playerName+" is the winner!");
        window.scrollTo(x-coord, y-coord);
      }

      // If player has to draw cards
      console.log("pred");
      if (hra.players[indexOfCurrentPlayer].cardsToDraw > 0) {
        console.log("po");
        var counter = false;
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].value == "7") {
            counter = true;
            var card7Index = i;
          }
        }

        // If player has card with value 7 in his hand
        if (counter) {
          var counterPermission = prompt("Do you want to draw "+hra.players[indexOfCurrentPlayer].cardsToDraw+" cards (1) or draw 0 cards for exchange for your card number 7 (2)? Type 1 or 2");

          // Take the cards
          if (counterPermission == 1) {
            for (var i = 0; i < hra.players[indexOfCurrentPlayer].cardsToDraw; i++) {
              hra.players[indexOfCurrentPlayer].addCard();
            }
            hra.players[indexOfCurrentPlayer].cardsToDraw = 0;
          }

          // Counter them
          else if (counterPermission == 2) {
            hra.players[indexOfCurrentPlayer].playCard(hra.players[indexOfCurrentPlayer].cards[card7Index]);
          }
        }

        else {
          for (var i = 0; i < hra.players[indexOfCurrentPlayer].cardsToDraw; i++) {
            hra.players[indexOfCurrentPlayer].addCard();
          }
          hra.players[indexOfCurrentPlayer].cardsToDraw = 0;
        }

        // Updating an array of cards that player has in his hand
        var cards = [];

        for (var i = 0; i < hra.players[indexOfCurrentPlayer].cards.length; i++) {
          cards.push(hra.players[indexOfCurrentPlayer].cards[i]);
        }

        // Additional update
        var additionalUpdate = true;
      }

      // For each card that player has in his hand
      // it creates html_string and concats it into cardsHtml string
      for (var i = 0; i < cards.length; i++) {
        var cardForConcat = cards[i];
        var cardHtml = '<li class="card"><img src="card_img/'+cardForConcat.image+'"><button class="playCard" disabled>PLAY</button><p class="color">'+cardForConcat.color+'</p><p class="value">'+cardForConcat.value+'</p></li>';
        cardsHtml = cardsHtml + cardHtml;
      }

      // It gets .player div into the page
      $("#players").append('<div class="box player"><div class="label"><span>'+playerName+'</span></div><button class="drawCard">DRAW</button><ul>'+cardsHtml+'</ul></div>');
    }
  }

  // Updating started game
  if (hra.players.length != 0) {

    // If main deck is empty, recycle it
    if (hra.deck.cards.length == 0){
      hra.deck.recycleDeck();
      updateGame();
    }

    // It updates #turn
    var playerName = hra.turn.playerName;
    $("#turn").text(playerName+"'s turn");

    // It allows player on his turn to play cards
    for (var i = 0; i < $(".player").length; i++) {
      if ($(".player").eq(i).find("span").text() == playerName){
        $(".player").eq(i).find("button").prop('disabled', false);
      }
    }

    // It updates #lastCard
    var lastCardPlayedImg = hra.lastCardPlayed.image;
    $("#lastCard").attr("src", "card_img/"+lastCardPlayedImg);

    // Additional Update (if you have to draw cards)
    if (additionalUpdate) {
      additionalUpdate = false;
      console.log("update");
      updateGame();
    }
  }

  // Player can draw card
  $(".drawCard").click(function() {
    var playerName = $(this).prev().text();
    var playerIndex = hra.playerNames.indexOf(playerName);
    var playerHand = hra.players[playerIndex];
    playerHand.drawCard();

    updateGame();
  });

  // Player can play card
  $(".playCard").click(function() {
    var cardLi = $(this).parent();
    var playerName = cardLi.parent().prev().prev().text();
    var playerIndex = hra.playerNames.indexOf(playerName);
    var playerHand = hra.players[playerIndex];

    var cardColor = cardLi.find(".color").text();
    var cardValue = cardLi.find(".value").text();
    var cardObject = new card(cardColor, cardValue, playerHand.deck);

    for (var i = 0; i < playerHand.cards.length; i++) {
      var tester = 0;

      if (playerHand.cards[i].color == cardObject.color) {
        tester++;
      }

      if (playerHand.cards[i].value == cardObject.value) {
        tester++;
      }

      if (tester == 2) {
        var cardPlayer = playerHand.cards[i];
      }
    }

    // If the card value is ober, player has to choose the new color
    if (cardPlayer.value == "ober"){
      var changeColor = prompt("Change color to 'heart', 'acorn', 'bell' or 'leaf'");

      // Check for correct color spelling
      if (changeColor == "heart" || changeColor == "acorn" || changeColor == "bell" || changeColor == "leaf") {
        playerHand.playCard(cardPlayer, changeColor);
      }
    }

    else {
      playerHand.playCard(cardPlayer);
    }

    updateGame();
  });
}
