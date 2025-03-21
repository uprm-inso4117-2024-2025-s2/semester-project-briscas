const { performance } = require("perf_hooks"); // Import performance API
const Deck = require("../models/Deck");

// The shuffle performance test measures how long the different shuffle methods take to execute.
// The tested shuffle methods are the fisher-yates, javascript sort, riffle, and the overhead.
console.log('--- Shuffle Performance Test ---');

function testFisherYates() {
    const deck = new Deck();

    const ShuffleStart = performance.now();
    deck.shuffle();
    const ShuffleEnd = performance.now();

    console.log(`Fisher-Yates Shuffle execution time: ${(ShuffleEnd - ShuffleStart).toFixed(3)} ms`);
}

function javascriptSortShuffle(deck) {
    return deck.sort(() => Math.random() - 0.5);
}

function riffleShuffle(deck) {
    const half = Math.floor(deck.length / 2);
    let leftHalf = deck.slice(0, half);
    let rightHalf = deck.slice(half);
    let shuffledDeck = [];

    while (leftHalf.length || rightHalf.length) {
        if (Math.random() > 0.5 && leftHalf.length) {
            shuffledDeck.push(leftHalf.shift());
        } else if (rightHalf.length) {
            shuffledDeck.push(rightHalf.shift());
        }
    }

    return shuffledDeck;
}

function overhandShuffle(deck) {
    let shuffledDeck = [];

    while (deck.length > 0) {
        let chunk = Math.floor(Math.random() * 5) + 1;
        shuffledDeck = shuffledDeck.concat(deck.splice(0, chunk));
    }

    return shuffledDeck;
}

// Tests the previously implemented shuffling algorithms that aren't the fisher-yates shuffling algorithm. 
function testShufflePerformance(shuffleFunction, name) {
    const deck = new Deck();

    const ShuffleStart = performance.now();
    deck.deck = shuffleFunction(deck.deck);
    const ShuffleEnd = performance.now();

    console.log(`${name} execution time: ${(ShuffleEnd - ShuffleStart).toFixed(3)} ms`);
}

// The following functions measure how long various functions within the Deck class take to execute.
function testDeckInitialization() {
    console.log('\n--- Deck Initialization Test ---');
    const deck = new Deck();

    const DeckInitStart = performance.now();
    deck.initializeDeck();
    const DeckInitEnd = performance.now();

    console.log(`Deck initialization execution time: ${(DeckInitEnd - DeckInitStart).toFixed(3)} ms`);
}

function testCardDrawing() {
    console.log('\n--- Card Drawing Test ---');
    const deck = new Deck();
    deck.shuffle();

    const DrawStart = performance.now();
    for (let i = 0; i < 40; i++) {
        deck.draw();
    }
    const DrawEnd = performance.now();

    console.log(`Time to draw forty cards: ${(DrawEnd - DrawStart).toFixed(3)} ms`);
}

function testTrumpSuitSetup() {
    console.log('\n--- Trump Suit Setup Test ---');
    const deck = new Deck();
    deck.shuffle();

    const TrumpSuitStart = performance.now();
    deck.setupTrumpSuit();
    const TrumpSuitEnd = performance.now();

    console.log(`Execution time for setting up the trump suit: ${(TrumpSuitEnd - TrumpSuitStart).toFixed(3)} ms`);
}

function testDisplayDeck() {
    console.log('\n--- Deck Display Test ---');
    const deck = new Deck();

    const DisplayDeckStart = performance.now();
    deck.shuffle();
    deck.displayDeck();
    const DisplayDeckEnd = performance.now();

    console.log(`Display deck execution time: ${(DisplayDeckEnd - DisplayDeckStart).toFixed(3)} ms`);
}


testFisherYates();
testShufflePerformance(javascriptSortShuffle, 'Javascript Sort Shuffle');
testShufflePerformance(riffleShuffle, 'Riffle Shuffle');
testShufflePerformance(overhandShuffle, 'Overhand Shuffle');
testDeckInitialization();
testCardDrawing();
testTrumpSuitSetup();
testDisplayDeck();