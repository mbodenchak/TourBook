const app = require('./app');

//START SERVER
const port = 3000;
app.listen(3000, () => {
  console.log('listening on port ' + port);
});
