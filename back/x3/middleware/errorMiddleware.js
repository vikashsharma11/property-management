/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  };
  /* eslint-enable no-undef */
/* eslint-enable no-unused-vars */
  
  module.exports = errorHandler;
  