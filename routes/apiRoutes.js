// ===============================================================================
// DEPENDENCIES
// ===============================================================================
var fs = require("fs");
var path = require("path");
const util = require("util");

// The built-in util package can be used to create Promise-based versions of functions using node style callbacks
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// ===============================================================================
// FUNCTIONS:
// ===============================================================================

async function readDBjson() {
    const dbJsonStr = await readFileAsync(path.join(__dirname, "../db/db.json"), "utf8")
    return JSON.parse(dbJsonStr)
}

function writeDBjson(data) {
    return writeFileAsync(path.join(__dirname, "../db/db.json"),JSON.stringify(data))
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // ---------------------------------------------------------------------------

    app.get("/api/notes", async function (req, res) {
        // Send result - the parsed JSON string to an object.
        res.json(await readDBjson());
    });

    // API POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // ---------------------------------------------------------------------------

    app.post("/api/notes", async function (req, res) {
        // req.body is available since we're using the body parsing middleware

        const userRequest = req.body;
        let databaseArray = await readDBjson();

        databaseArray.push(userRequest);

        await writeDBjson(databaseArray)
        
        res.json(userRequest);
    });

};
