class AppError extends Error {
  statusCode: number; //this is cuz we are using TS. in JS there is no need of this
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;

// Object.setPrototypeOf(this, AppError.prototype)
// This line is an old compatibility workaround that explicitly forces this → AppError.prototype.
// const error = new AppError() normally sets prototype chain correctly.


//built in Error class looks like this internally and constructor is receving the message so we passed in super(message)
//and we added statusCode extra to the object which will be created using this AppError class
// class Error {
//   constructor(message) {
//     this.message = message;   // sets the standard `.message` property
//     this.stack = ...;          // captures a stack trace
//     this.name = 'Error';       // default name
//   }
// }


// error
//  ↓ __proto__
// AppError.prototype
//  ↓ __proto__
// Error.prototype
//  ↓ __proto__
// Object.prototype
//  ↓ __proto__
// null