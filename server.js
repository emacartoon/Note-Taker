const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Middleware Functions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static file hosting for public directory
app.use(express.static("public"));


// HTML Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API Routes
app.get("/api/notes", function (req, res) {
  // Retrieve all notes and res.json them back to the front end
  res.json(data);
  // Read the contents of db.json
  fs.readFile("/db/db.json", "utf8", function (err, data) {
    // send them to the user
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", function (req, res) {
  // Create a note from req.body
  const note = {
    id: uuidv4(),
    title: req.body.title,
    test: req.body.text,
  };

  // Read the data from the db json
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    // Parse out the array
    const note = JSON.parse(data);
    // push to the array
    data.push(note);
    res.json(note);
    // Stringify array
    // respond to user

    console.log(note);
  });
});

app.delete("api/notes:id", function (req, res) {
  // Delete a note based off id
  const { id } = req.params;
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, note) {
    if (err) throw err;
    const notes = JSON.parse(note);
    const newNotes = notes.filter((note) => note.id !== id);
    res.json(newNotes);
  });
  // Write to file
  fs.writeFile(
    __dirname + "/db/db.json",
    JSON.stringify(newNotes),
    function (err, note) {
      if (err) throw err;
      res.end("Successfully Deleted");
    }
  );
});

app.listen(PORT, () => console.log("App listening on port " + PORT));
