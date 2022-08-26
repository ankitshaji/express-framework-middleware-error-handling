//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const app = express(); //appObject
const CustomErrorClassObject = require("./CustomError"); //CustomErrorClassObject //self created module/file needs "./"

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods - Order matters for next() execution
// *************************************************************************************************************************************
//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback gets passed in 3 arguments (req,res,nextCallback)

// **********************************************************************************************************************
//Express error handling //errorHandlerMiddlewareCallback takes 4 arguments (errObject,reqObject,resObject,nextCallback)
// **********************************************************************************************************************
//case1 - using default ErrorClassObject("message") - creating instance object - > errorClassInstanceObject
//defaultErrorHandlerMiddlewareCallback(invisible) and customeErrorHandlerMiddlewareCallbacks(user defined)-
//syntax error/variable undefined error OR explicitly throw an error IN middlewareCallbacks and handlerCallbacks
//implicitly/explicitly throws an error in middlewareCallback and handlerCallbacks ,(throw new Error("message"))
//throw new Error("message") implicitly calls next(errorClassInstanceObject) - sending errorClassInstanceObject to next ErrorHandlerMiddlewareCallback
//if next ErrorHandlerMiddlewareCallback is defaultErrorHandlerMiddlewareCallback(invisible)
//express defaultErrorHandlerMiddlewareCallback auto sends (http structured) response to end request-response cycle, content-type:text/html
//responseObject-res.body:errorClassInstanceObject.message + errorClassInstanceObject.stack ie.stack trace of error(dev)/errorClassInstanceObject.message(prod) ,res.statusCode:auto set default 500,res.statusMessage:auto set from status code
//else if next ErrorHandlerMiddlewareCallback is customeErrorHandlerMiddlewareCallback(user defined)
//we can send (http structured) response ourselves to end request-response cycle,content-type:what we define,
//responseObject-res.body:what we define,res.statusCode:what we define,res.statusMessage:what we define
//or we can call next(errorClassInstanceObject) to pass it to the next ErrorHandlerMiddlewareCallback

//case2 - using CustomErrorClassObject("message",statusCode) inherits from ErrorClassObject() - creating instance object - > customErrorClassInstanceObject
//defaultErrorHandlerMiddlewareCallback(invisible) and customeErrorHandlerMiddlewareCallbacks(user defined)-
//Explicitly throw error IN middlewareCallbacks and handlerCallbacks //throw new CustomErrorClassObject("message",statusCode))
//CustomeErrorClassObject lets us add a status property in customErrorClassInstanceObject
//throw new CustomErrorClassObject("message",statusCode) implicitly calls next(customErrorClassInstanceObject) - sending customErrorClassInstanceObject to next ErrorHandlerMiddlewareCallback
//if next ErrorHandlerMiddlewareCallback is defaultErrorHandlerMiddlewareCallback(invisible)
//express defaultErrorHandlerMiddlewareCallback auto sends (http structured) response to end request-response cycle, content-type:text/html
//responseObject-res.body:customErrorClassInstanceObject.message + customErrorClassInstanceObject.stack ie.stack trace of error(dev)/customErrorClassInstanceObject.message(prod) ,res.statusCode:customErrorClassInstanceObject.status, res.statusMessage:auto set from status code
//else if next ErrorHandlerMiddlewareCallback is customeErrorHandlerMiddlewareCallback(user defined)
//we can send (http structured) response ourselves to end request-response cycle,content-type:what we define,
//responseObject-res.body:what we define,res.statusCode:what we define,res.statusMessage:what we define
//or we can call next(errorClassInstanceObject) to pass it to the next ErrorHandlerMiddlewareCallback

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
  // res.status(401); //dont do this - To change statusCode use create a CustomeErrorClassObject

  //explicitly throw an error in middlewareCallback
  //CustomErrorClassObject("message",statusCode) //sends arguments to constructor method //new keyword creates customErrorClassInstanceObject
  throw new CustomErrorClassObject("password required", 401);
  //implicite next(customErrorClassInstanceObject)

  //explicitly throw an error in middlewareCallback
  //ErrorClassObject("message") //sends arguments to constructor method //new keyword creates ErrorClassInstanceObject
  throw new Error("password required");
  //implicite next(errorClassInstanceObject)
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
  //variable not defined - implicite throw new Error("message")
  //ErrorClassObject("messages") //sends arguments to constructor method //new keyword creates errorClassInstanceObject
  chicken.fly();
  ///implicite next(errorClassInstanceObject)
});

app.get("/admin", () => {
  //explicitly throw an error in middlewareCallback
  //CustomErrorClassObject("message",statusCode) //sends arguments to constructor method //new keyword creates customErrorClassInstanceObject
  throw new CustomErrorClassObject("You're not an admin", 403);
  //implicite next(customErrorClassInstanceObject)
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
//app.use(customErrorHandlerMiddlewareCallback)
//customErrorHandlerMiddlewareCallback takes in 4 arguments -(errorClassInstanceObject/customErrorClassInstanceObject,resObject,reqObject,nextCallback)

//customErrorHandlerMiddlewareCallback(errorClassInstanceObject,resObject,reqObject,nextCallback)
// app.use((err, req, res, next) => {
//   console.log("****ERROR*****");
//   next(err); //pass (errro/customError)ClassInstanceObject onto next (custom/default)errorHandlerMiddlewareCallback
// });

//customErrorHandlerMiddlewareCallback(errorClassInstanceObject/customErrorClassInstanceObject,resObject,reqObject,nextCallback)
app.use((err, req, res, next) => {
  //customeErrorClassInstanceObject has property status, errorClassInstanceObject's status property is undefined
  //both instances have a message property + other methods and properties such as stack
  //key to variable + set default values if undefined - object destructuring
  const { status = 500, message = "Something went wrong" } = err; //errorClassInstanceObject
  res.statusMessage = "I can edit this instead of being auto set from status";
  res.status(status).send(message); //convert responseObject and send (http structured) response - ending request-response cycle
  // next(errorClassInstanceObject); //could pass errorClassInstanceObject to defaultErrorHandlerMiddlewareCallback(invisible)
});
//**************************************************
//INVISIBLE - defaultErrorHandlerMiddlewareCallback
//**************************************************

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
