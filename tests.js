import { createRequire } from "module";
const require = createRequire(import.meta.url);

console.log("Testing project...")
const sleep = t => new Promise(r => setTimeout(r, t))
const files = require("fs").readdirSync("./tests")
const timeout = setTimeout(() => {
    throw new Error("Testing completed!");
}, 60000);
for(const i in files){
    var file = files[i];
    file = file.slice(0,-3)
    console.log(file);
    try{
        require("./tests/"+file);
    } catch(error){ console.log(error)}
    await sleep(22000)
    timeout.refresh()
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
}