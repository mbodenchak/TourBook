//Catch Async wrapper to allow leaner functions sans trycatch blocks
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
