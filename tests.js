console.log("Testing project...")

// Insert hooks into existing tests below

const files = require("fs").readdirSync("./tests")
for(const i in files){
    var file = files[i];
    file = file.slice(0,-3)
    console.log(file);
    try{require("./tests/"+file);} catch(error){ console.log(error)}
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}

console.log("Testing completed!")
