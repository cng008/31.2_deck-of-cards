let baseURL = 'http://deckofcardsapi.com/api/deck';

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).
$.getJSON(`${baseURL}/new/draw/`).then(data => {
  let { value, suit } = data.cards[0];
  console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
});

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.
let firstCard = null;
$.getJSON(`${baseURL}/new/draw/`)
  .then(data => {
    firstCard = data.cards[0];
    let deckId = data.deck_id;
    return $.getJSON(`${baseURL}/${deckId}/draw/`);
  })
  .then(data => {
    let secondCard = data.cards[0];
    [firstCard, secondCard].forEach(card => {
      console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
    });
  });

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.
let $btn = $('#draw-btn');
let $cardDiv = $('#card-container');

$.getJSON(`${baseURL}/new/shuffle/`).then(data => {
  let deckId = data.deck_id;
  $btn.on('click', () => {
    $.getJSON(`${baseURL}/${deckId}/draw/`)
      .then(data => {
        let cardSrc = data.cards[0].image;
        let angle = Math.random() * 90 - 45;
        let randomX = Math.random() * 40 - 20;
        let randomY = Math.random() * 40 - 20;
        $cardDiv.append(
          $('<img>', {
            src: cardSrc,
            css: {
              position: 'absolute',
              left: 0,
              right: 0,
              margin: 'auto',
              transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
            }
          })
        );
        $('p').text(`cards remaining in deck: ${data.remaining}`);
        if (data.remaining === 0) {
          $btn.text('Shuffle').on('click', () => {
            location.reload();
          });
        }
      })
      .catch(() => {});
  });
});

/** EXTRA
 * change header color every few seconds on hover
 */

const h1 = $('h1');

changeColor = (el, color) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      el.addClass(color);
      resolve();
    }, 1000);
  });
};

h1.on('mouseover', () => {
  h1.removeClass();
  changeColor(h1, 'text-primary')
    .then(() => changeColor(h1, 'text-secondary'))
    .then(() => changeColor(h1, 'text-success'))
    .then(() => changeColor(h1, 'text-info'))
    .then(() => changeColor(h1, 'text-warning'))
    .then(() => changeColor(h1, 'text-danger'))
    .then(() => changeColor(h1, 'text-light'))
    .then(() => changeColor(h1, 'text-primary'));
});
