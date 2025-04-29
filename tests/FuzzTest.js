const Fuzzer = require("../models/Fuzzer")


console.log("Give me a random lowercase string of 1000 characters!\n")
Fuzzer.charFuzz(1000, true, "a", 25);

console.log("\n\nHow about a random number string that goes up to 500 characters?\n")
Fuzzer.charFuzz(250, false, "0", 9);

console.log("\n\nWhat about the majority of presentable characters in ASCII, say, from 0 and up, including missing characters, 624 of them please!")
Fuzzer.charFuzz(624, true, 0, 255);

console.log("\n\nMaybe a random number between 2 and 5?\n")
Fuzzer.numFuzz(2, 5);