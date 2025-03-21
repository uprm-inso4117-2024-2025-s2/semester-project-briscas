declare class Card {
    suit: string;
    rank: string;
    points: number;
    id: string;
    constructor(suit: string, rank: string);
    updateCard(newSuit:string,newRank:string);
    displayCard(): string;
    beats(otherCard: Card, trumpSuit: string): boolean;
}

export = Card;