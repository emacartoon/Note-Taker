const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;


// HTML Routes
// Index page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API Routes
// Retrieve all notes
app.get("/api/notes", function (req, res) {

  // Read the contents of db.json
  fs.readFile("./db/db.json", "utf8", function (err, data) {

    // Respond with the parsed string back to the user
    res.json(JSON.parse(data));
  });
});

// Create a note from req.body
app.post("/api/notes", function (req, res) {
  const note = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  // Read the data from the db json
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;

    // Parse out the array
    var parseData = JSON.parse(data);

    // push to the array
    parseData.push(note);

    // Stringify array
    parseData = JSON.stringify(parseData);

    // Write the stringified array to the DB.JSON file
    fs.writeFile("./db/db.json", parseData, function (err, data) {
      if (err) throw err;
    });

    // respond to user
    res.json(parseData);
  });

});

// Delete Notes
app.delete("/api/notes/:id", function (req, res) {
  // Delete a note based off id
  const { id } = req.params;
  // Get
  fs.readFile("./db/db.json", "utf8", function (err, note) {
    if (err) throw err;

    // Notes of parsed Note
    var notes = JSON.parse(note);

    //Filter the notes by ID until it finds the one to delete, and keep others
    const newNotes = notes.filter((note) => note.id !== id);

    // Write back the remaining notes to keep
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), function (err, note) {
      if (err) throw err;
      res.send("Successfully Deleted");
    });
  });
});

app.listen(PORT, () => console.log("App listening on port " + PORT));
