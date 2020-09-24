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
    return writeFileAsync(path.join(__dirname, "../db/db.json"), JSON.stringify(data, null, 2))
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

    // API GET Requests
    // ---------------------------------------------------------------------------

    app.get("/api/notes", async function (req, res) {
        // Send result - the parsed JSON string to an object.
        res.json(await readDBjson());
    });

    // API POST Requests
    // ---------------------------------------------------------------------------

    app.post("/api/notes", async function (req, res) {
        const newNote = req.body;

        // Read data and return parsed object
        let databaseArray = await readDBjson();

        if (newNote.id === "0") {
            // Find id to attach to new note
            newNote.id = databaseArray.length + 1;
            // New note added to db
            databaseArray.push(newNote);
        } else {
            databaseArray[(newNote.id - 1)] = newNote
        }

        // Write a new db.json
        await writeDBjson(databaseArray);
        // response with JSON object of new note
        res.json(newNote);
    });

    // API DELETE Requests
    // ---------------------------------------------------------------------------
    app.delete("/api/notes/:id", async function (req, res) {

        // Chosen index element (if id is zero, true if statement in index.js will skip )
        var chosen = req.params.id - 1;
        // Read data and return parsed object
        const currentDBarray = await readDBjson();

        let noteID = 0;
        // Remove chosen note and assign new id to remaining notes
        const removedDBarray = currentDBarray.filter((note, i) => {
            if (i === chosen) {
                return false
            } else {
                note.id = noteID + 1;
                noteID += 1;

                return true
            }
        })
        // Write a new db.json
        await writeDBjson(removedDBarray);
        // response back to html to let it know that process has finished
        res.json(true)

    });

};
