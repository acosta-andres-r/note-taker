// ===============================================================================
// DEPENDENCIES
// We need to include the fs package to store and retrieve notes from .json file.
// We need to include the path package to get the correct file path for our html.
// ===============================================================================
var fs = require("fs");
var path = require("path");
const util = require("util");

// The built-in util package can be used to create Promise-based versions of functions using node style callbacks
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

    // API GET Requests
    // Below code handles when users "visit" a page.
    // In each of the below cases when a user visits a link
    // ---------------------------------------------------------------------------

    app.get("/api/notes", function (req, res) {

        console.log('entered');
        readFileAsync(path.join(__dirname, "../db/db.json"), "utf8")
            .then(function (data) {
                console.log(data);
                // Parse the JSON string to an object to send result
                res.json(JSON.parse(data));
            });
    });

};
