const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');
const uuid = require('./helpers/uuid');



const PORT = 3001;

const app = express();
const router = express.Router();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

console.log('jump');

app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));

});


app.delete('/api/notes/:id', (req, res) => {
  var reqID = req.params.id;
  
  for (let i = 0; i < noteData.length; i++) {
    var noteID = noteData[i].id;
    if (noteID === reqID) {
      console.log("NOTE FOUND!")
      console.log(noteData[i])
      noteData.splice(i, 1)
      console.log(noteData[i]+"NOTE DELETED!")
    }
  }
});


app.post('/api/notes/', (req, res) => {
    
    const { title, text } = req.body;
  
    if (title && text) {
      
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      console.log(newNote);
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          
          const parsedNotes = JSON.parse(data);
  
         
          parsedNotes.push(newNote);
  
          
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.json(noteData);
    } else {
      res.json('Error in posting note');
    }
  });

app.get('/api/notes', (req, res) => {

    res.json(noteData);
    // res.sendFile(noteData);

    console.log("successful!");
});


app.listen(PORT, () => {
  console.log(`Note Taker Server listening at http://localhost:${PORT}`);

});
