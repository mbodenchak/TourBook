const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception - shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); //console.logs whether in dev or prod
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

//START SERVER
const port = 3000;
const server = app.listen(3000, () => {
  console.log('listening on port ' + port);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection - shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
