let baseURL = 'http://deckofcardsapi.com/api/deck';

// 1. Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).

async function newCardNewDeck() {
  let res = await axios.get(`${baseURL}/new/draw/`);
  let { value, suit } = res.data.cards[0];
  console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
}
newCardNewDeck();

// 2. Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.
// Once you have both cards, console.log the values and suits of both cards.

async function newCardNewDeck() {
  let firstCardData = await axios.get(`${baseURL}/new/draw/`);
  let deckId = firstCardData.data.deck_id;
  let secondCardData = await axios.get(`${baseURL}/${deckId}/draw/`);
  [firstCardData, secondCardData].forEach(card => {
    let { value, suit } = card.data.cards[0];
    console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
  });
}
newCardNewDeck();

// 3. Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.
const $btn = $('#draw-btn');
const $cardDiv = $('#card-container');

async function init() {
  let deckData = await axios.get(`${baseURL}/new/shuffle/`);

  $btn.on('click', async function () {
    let cardData = await axios.get(`${baseURL}/${deckData.data.deck_id}/draw/`);
    let cardSrc = cardData.data.cards[0].image;
    console.log(cardSrc);
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
    $('p').text(`cards remaining in deck: ${cardData.data.remaining}`);
    if (cardData.data.remaining === 0) {
      $btn.text('Shuffle').on('click', () => {
        location.reload();
      });
    }
  });
}
init();

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

async function colors(el) {
  await changeColor(el, 'text-primary');
  await changeColor(el, 'text-secondary');
  await changeColor(el, 'text-success');
  await changeColor(el, 'text-info');
  await changeColor(el, 'text-warning');
  await changeColor(el, 'text-danger');
  await changeColor(el, 'text-light');
  await changeColor(el, 'text-primary');
}
h1.on('mouseover', () => {
  h1.removeClass();
  colors(h1);
});
