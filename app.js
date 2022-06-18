const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post as well!');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//ROUTES
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.send('Done');
});

const port = 3000;
app.listen(3000, () => {
  console.log('listening on port ' + port);
});
