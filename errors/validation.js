const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class ValidationError extends CustomAPIError {
  constructor(message, errors) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.errors = errors
  }
}

module.exports = ValidationError;
