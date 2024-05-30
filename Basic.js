import express from "express";
import fs from 'fs';
import path from 'path';
import os from 'os';
// Create an Express application
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Define a GET route
app.get("/", (req, res) => {
  res.send("<h1>HELLO</h1>");
});
// Endpoint to create a text file with the current timestamp
app.post('/create-timestamp-file', (req, res) => {
  
// Get the current date and time
  const now = new Date();
  const timestamp = now.toISOString();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateStr = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  const fileName = `${dateStr}.txt`;

  const folderPath = path.join(os.tmpdir(), 'timestamps');

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, fileName);

  fs.writeFile(filePath, timestamp, err => {
    if (err) {
      return res.status(500).send('Error writing file');
    }
    res.send(`File created at ${filePath}`);
  });
});
// Endpoint to list all the files in the timestamps directory
app.get('/list-timestamp-files', (req, res) => {
  const folderPath = path.join(os.tmpdir(), 'timestamps');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }
    res.json(files);
  });
});

// Start the server
app.listen(port, () => {
  console.log(new Date().toString(), "server listening on port " + port);
});
