const express = require('express');
const app = express();
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

app.use(cors()); // Allow all origins

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, World!');
  console.log("Hello Jagriti");
});




const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
