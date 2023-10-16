import express from 'express';
import path from 'path';
import fs from 'fs'; // Import the 'fs' module
import cors from 'cors';
const __dirname = path.resolve(path.dirname(''));
const app = express();
const port = 3000;

const whitelist = ['http://127.0.0.1:5500'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Allow requests from the whitelist and requests with no origin (e.g., file:// for local files)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.get('/api/all-cards', (req, res) => {
  // Read the contents of the 'all_cards_data.json' file and send it as JSON
  const allCardsDataPath = path.join(__dirname, 'data', 'all_cards_data.json');
  const allCardsData = fs.readFileSync(allCardsDataPath, 'utf-8');
  res.json(JSON.parse(allCardsData));
});

app.listen(port, () => {
  console.log(`Server successfully running on port ${port}`);
});

// app.get('/api/all-cards', async (req, res) => {
//   try {
//     await processData();
//     // Now cardsData should be populated
//     const data = { cardsData: JSON.stringify(ALL_CARDS_DATA) };
//     res.json(data);
//   } catch (error) {
//     console.error('Error processing data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

//////////////////////////////////////////////________________
//const __dirname = path.resolve(path.dirname(''));

// const app = express();
// const port = 3000;
// const router = express.Router()


// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', async(req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.use('/', router);
// app.listen(3000, () => {
//   console.log("Server successfully running on port 3000");
// });
/////////////////_________________________________________________________

// app.get('/', (req, res) => {
//   res.send('Server is running'); // You can customize this message
// });

// app.get('/public', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Start the Express server and fetch data
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   processData().then(() => {
//     exportData();
//   });
//   console.log(ALL_CARDS_DATA);
// });
