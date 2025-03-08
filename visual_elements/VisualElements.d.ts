declare class Card {
    suit: string;
    rank: string;
    points: number;
    constructor(suit: string, rank: string);
    displayCard(): string;
    beats(otherCard: Card, trumpSuit: string): boolean;
}

export = Card;