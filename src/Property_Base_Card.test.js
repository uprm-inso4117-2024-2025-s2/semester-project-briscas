
const Card = require("../models/Card");
const fc = require("fast-check");

const suits = ["Oros", "Copas", "Espadas", "Bastos"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];


describe('UtilityTest', () => {
  test('Card beats same card', () => {
    fc.assert(
      fc.property(fc.integer({ max: 3, min:0  }), fc.integer({ max: 9, min:0  }),fc.integer({ max: 3, min:0  }), (a, b,c) => {
        trump = suits[c];
        bool = false;
        c1 = new Card(suits[a],ranks[b]);
        c2 = c1;
        bool = false
        if((c1.beats(c2, trump) == false  && c2.beats(c1, trump) == false)){
          bool =  true
        }
        else{
          bool = false
        }
        expect(bool).toEqual(true);
      })
    );
  });
  test('Card beats trump card', () => {
    fc.assert(
      fc.property(fc.integer({ max: 3, min:0 }), fc.integer({ max: 9, min:0  }),fc.integer({ max: 3, min:0  }), fc.integer({max:9, min:0 }), (a, b, c ,d) => {
        trump = suits[a];
        bool = false;
        c1 = new Card(suits[a],ranks[b]);
        c2 = new Card(suits[c],ranks[d]);
        if(c1.suit == c2.suit){
          c2.suit = suits[(c+1)%4];
        }
        bool = false
        if((c1.beats(c2, trump) == true  && c2.beats(c1, trump) == false)){
          bool =  true
        }
        else{
          bool = false
        }
        expect(bool).toEqual(true);
      })
    );
  });

  test('Card beats higher card', () => {
    fc.assert(
      fc.property(fc.integer({ max: 3, min:0 }), fc.integer({ max: 9, min:0  }), fc.integer({max:9, min:1 }), (a, b, d) => {
        trump = suits[a];
        bool = false;
        t = b;
        t2 = d;
        c1 = new Card(suits[a],ranks[b]);
        c2 = new Card(suits[a],ranks[d]);
        // makes sure taht c1 wins
        if(c1.ranks[c1.rank] == 0 || c1.ranks[c1.rank]<= c2.ranks[c2.rank]){
          c1.rank = ranks[0];
        }
        bool = false
        if((c1.beats(c2, trump) == true  && c2.beats(c1, trump) == false)){
          bool =  true
        }
        else{
          bool = false
        }
        expect(bool).toEqual(true);
      })
    );
  });

})

// tests without assert

// test('Card beats same card', () => {
//   count = 0
//   times = 1000
//   for(i = 0;i <times;i++){
//     a = new Card(suits[Math.floor(Math.random() * 4)], ranks[Math.floor(Math.random() * 10)]);
//     b = a;
//     trump = suits[Math.floor(Math.random() * 4)];
//     if(a.beats(b, trump) == false  && b.beats(a, trump) == false){
//       count++
//     }
//   }
//    expect(times).toEqual(count);
//   })

  // test('Card beats trump card', () => {
  //   // trump card set to oros
  //   count = 0
  //   times = 1000
  //   for(i = 0;i <times;i++){
  //     a = new Card(suits[3], ranks[Math.floor(Math.random() * 10)]);
  //     b = new Card(suits[Math.floor(Math.random() * 3)], ranks[Math.floor(Math.random() * 10)]);
  //     trump = suits[3];
  //     if(a.beats(b,trump) == true && b.beats(a, trump) == false){
  //       count++
  //     }
  //   }
  //    expect(times).toEqual(count);
  //   })

  // test('Card beats higher card', () => {
  //   count = 0
  //   times = 1000
  //   for(i = 0;i <times;i++){
  //     s = Math.floor(Math.random() * 4)
  //     r = Math.floor(Math.random() * 9);
  //     r2 = (r+1)%10;
  //     a = new Card(suits[s], ranks[r]);
  //     b = new Card(suits[s], ranks[9]);
  //     trump = suits[Math.floor(Math.random() * 4)];
  //     if(a.beats(b, trump) == !b.beats(a, trump)){
  //       count++;
  //     }
  
  //   }
  //    expect(times).toEqual(count);
  //   })