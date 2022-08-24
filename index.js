//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
const morgan = require("morgan"); //functionObject //morgan module

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback gets passed in arguments (req,res,nextCallback)

// **********************
//Express error handling
// **********************
//Case 1 - defaultErrorHandlerMiddlewareCallback(invisible)-
//1.1 -
//syntax error or variable undefined error in middlewareCallbacks and handlerCallbacks
//express defaultErrorHandlerMiddlewareCallback auto sends (http structured) response to end request-response cycle, content-type:text/html
//responseObject-res.body:stack trace of error(dev)/status message(prod) ,res.statusCode: default 500, res.statusMessage: internal server error
//1.2 -
//explicitly throw an error in middlewareCallback and handlerCallbacks ,(throw new Error("errorMessage"))
//express defaultErrorHandlerMiddlewareCallback auto sends (http strucutred) response to end request-response cycle, content-type:text/html
//responseObject-res.body:errorMessage+stack trace of error(dev)/status message(prod) ,res.statusCode: default 500, res.statusMessage: internal server error

// *************************
//customMiddlewareCallbacks
// *************************

//app.use(middlewareCallback)
app.use((req, res, next) => {
  //Decorating the req object
  req.requestTime = Date.now(); //adding new property on all req object
  next();
});

//app.use(pathString,middlewareCallback)
app.use("/dogs", (req, res, next) => {
  //Decorating the req object
  console.log("Dogs");
  next();
});

//fakeVerifyPasswordMiddlewareCallback - middlewareCallback(function expression) stored in variable
const fakeVerifyPasswordMiddlewareCallback = (req, res, next) => {
  const { password } = req.query; //requires ?queryString
  if (password === "pass123") {
    next();
  }
  //explicitly throw an error in middlewareCallback
  throw new Error("password required"); //errorInstanceObject(errorMessage+stackTrace)
  //catches errInstanceObject in customErrorHandlerMiddlewareCallback which then passes errInstanceObject to next errorHandlerMiddlewareCallback ie-defaultErrorHandlerMiddlewareCallback
  //express defaultErrorHandlerMiddlewareCallback auto sends (http structured) response to end request-response cycle, content-type:text/html
  //responseObject-res.body:errInstanceObject(errorMessage+stackTrace)(dev)/status message(prod) ,res.statusCode: default 500, res.statusMessage: internal server error
};

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//app.method(pathString ,handlerMiddlewareCallback)
app.get("/", (req, res) => {
  console.log(`Request Date: ${req.requestTime}`); //handlerMiddlewareCallbacks req now contains new property
  res.send("Home Page");
});

//route2
//app.method(pathString ,handlerMiddlewareCallback)
app.get("/dogs", (req, res) => {
  console.log(`Request Date: ${req.requestTime}`); //handlerMiddlewareCallbacks req now contains new property
  res.send("Dogs Page");
});

//route3
//app.method(pathString ,customMiddlewareCallback,handlerMiddlewareCallback)
app.get("/secret", fakeVerifyPasswordMiddlewareCallback, (req, res) => {
  res.send(
    "Secret: Sometimes i wear headphones in public so i dont have to talk to anyone"
  );
});

//route4
//app.method("pathString,handlerMiddlewareCallback")
app.get("/error", (req, res) => {
  //variable not defined error
  chicken.fly();
  //catches errInstanceObject in customErrorHandlerMiddlewareCallback which then passes errInstanceObject to next errorHandlerMiddlewareCallback ie-defaultErrorHandlerMiddlewareCallback
  //express defaultErrorHandlerMiddlewareCallback auto sends (http structured) response to end request-response cycle, content-type:text/html
  //responseObject-res.body:errInstanceObject(errorMessage+stackTrace)(dev)/status message(prod) ,res.statusCode: default 500, res.statusMessage: internal server error
});

//app.use(middlewareCallback)
//if no method or path was matched
app.use((req, res) => {
  //responseObject.statusMethod(argument-numCode) returns responseObject with updated statusCode
  res.status(404).send("Not Found");
});

// ************************************
//customErrorHandlerMiddlewareCallback
// ************************************

//app.use(errorHandlerMiddlewareCallback)
//errorHandlerMiddlewareCallback takes arguments -(errorInstanceObject,resObject,reqObject,nextCallback)
app.use((err, req, res, next) => {
  console.log("****ERROR*****");
  next(err); //pass errorInstanceObject onto next errorHandlerMiddlewareCallback
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
