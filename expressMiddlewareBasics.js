//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
const morgan = require("morgan"); //functionObject //morgan module
const methodOverride = require("method-override"); //functionObject //method-override module

// *************************************************************************************************************************************
//(Third party)middleware(hook) function expressions and (express built-in) middleware(hook)methods - Order matters for next() execution
// *************************************************************************************************************************************

//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//app.use(middlewareCallback) - argument is middlewareCallback
//app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback can -
//1.end request by sending (http structured) response ie res.send()
//2.move onto next middlewareCallback in stack with next()
//3.come out of app.use() with next('route') and go to next app.method()
//4.middlewareCallback gets passed 3 arguments - (req,res,next)
//5.middlwareCallback for error gets passed 4 arguemnts - (err,req,res,next)
// app.use(() => {
//   console.log("Waiting without responding back or moving onto next middleware");
// });

//(Third party)
//middlewareCreationFunctionObject(argument)-argument can be custom string eg."dev","common",":method :url :status :res[content-length] - :response-time ms"
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback - logs (http structured) request info into shell before calling next() to go to next middlewareCallback or app.method()
//sidenote - statusCode -304 Not Modified is similar to 200 ok
// app.use(morgan("dev")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Third party)
//middlewareCreationFunctionObject(argument) - argument is key to look for
//middlewareCreationFunctionObject execution creates middlewareCallback
//middlewareCallback  - sets req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE before moving to next middlewareCallback
//sidenote -  ?queryString is (?key=value), therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(express built-in)
//expressFunctionObject.middlewareCreationMethod(argument) - argument is object
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Accept form data - (http structured) POST request body parsed to req.body before before moving to next middlewareCallback
//sidenode - (http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(express built-in)
//expressFunctionObject.middlewareCreationMethod(argument) - argument is object
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Accept json data - (http structured) POST request body parsed to req.body before moving to next middlewareCallback
//sidenode - (http structure) POST request could be from browser form or postman
app.use(express.json()); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(express built-in)
//expressFunctionObject.middlewareCreationMethod(argument) - argument is staticFileDirectoryString
//middlewareCreationMethod execution creates middlewareCallback
//middlewareCallback - Accept static data - get files from directory before moving to next middlewareCallback
//app.use(express.static("staticFileDirectory")); //app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
//middlewareCallback calls next() inside it to move to next middlewareCallback

//(Application-level middleware) - bind middlewareCallback to appObject with app.use() or app.method()
//User created custom middlewareCallbacks - gets passed in arguments (req,res,nextCallback)
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
app.use((req, res, next) => {
  //Decorating the req object
  // req.method = "GET"; //chaning property of all req object
  req.requestTime = Date.now(); //adding new property on all req object
  // console.log(req.method, req.path);
  next();
});
//app.use(path/resource,middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to specific path/resource
app.use("/dogs", (req, res, next) => {
  //Decorating the req object
  // console.log("Dogs");
  next();
});
//app.use(middlewareCallback) //app.use() lets us execute middlewareCallback on any http method/every (http structured) request to any path
// app.use((req, res, next) => {
//   console.log("User created middlewareCallback 1");
//   next(); //passing to next middlewareCallback
//   console.log("Will run after everything"); //comeback and run this after all middlewareCallbacks are run
// });
// app.use((req, res, next) => {
//   console.log("User created middlewareCallback 2");
//   return next(); //passing to next middlewareCallback
//   console.log("Wont run since we returned"); //wont run since we left this middlewareCallback with return keyword
// });

//selective middlewareCallback use in specific routes ie specific method and specific path
//fakeVerifyPassword custom middlewareCallback(function expression) stored in variable //middlewareCallbacks(function expressions) - gets passed in arguments (req,res,nextCallback)
//To set it in specific route ,we can pass it as argument along with routeHandlerMiddlewareCallback
const fakeVerifyPasswordMiddlewareCallback = (req, res, next) => {
  //?queryString =?key=value
  //reqObject.query = {key:value}
  //key to variable - object destrcuturing
  const { password } = req.query;
  //ternary operator -execute next middlewareCallback or send (http strucutred) response and end cycle
  password === "pass123" ? next() : res.send("Sorry you need password");
};

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//app.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /
//arguments passed in to handlerMiddlewareCallback -
//if not already converted convert (http structured) request to req jsObject
//if not already created create res jsObject
//nextCallback
app.get("/", (req, res) => {
  //res.set("content-type", "text/plain");
  console.log(`Request Date: ${req.requestTime}`); //handlerMiddlewareCallbacks req now contains new property
  res.send("Home Page");
  //responseObject.sendMethod() - converts and sends res jsObject as (http structure)response //content-type:text/plain});
  //thus ending request-response cycle
});

//route2
//httpMethod=GET,path/resource-/dogs -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (dogs)collection from (missing)db
//app.method(pathString ,handlerMiddlewareCallback) lets us execute handlerMiddlewareCallback on specifid http method/every (http structured) request to specified path/resource
//execute handlerMiddlwareCallback if (http structured) GET request arrives at path /dogs
//arguments passed in to handlerMiddlewareCallback -
//if not already converted convert (http structured) request to req jsObject
//if not already created create res jsObject
//nextCallback
app.get("/dogs", (req, res) => {
  console.log(`Request Date: ${req.requestTime}`); //handlerMiddlewareCallbacks req now contains new property
  res.send("Dogs Page");
  //responseObject.sendMethod(argument-bodyDataString) - converts and sends res jsObject as (http structure)response //content-type:text/plain});
  //thus ending request-response cycle
});

//route3
//httpMethod=GET,path/resource-/secret -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (secrets)collection from (missing)db
//app.method(pathString ,otherPreMiddlewareCallback,handlerMiddlewareCallback) lets us execute both callbacks on specifid http method/every (http structured) request to specified path/resource
//execute otherPreMiddlewareCallback - potential next() to - handlerMiddlewareCallback ,if (http structured) GET request arrives at path /secrets
//arguments passed in to handlerMiddlewareCallback -
//if not already converted convert (http structured) request to req jsObject
//if not already created create res jsObject
//nextCallback
app.get("/secret", fakeVerifyPasswordMiddlewareCallback, (req, res) => {
  res.send(
    "Secret: Sometimes i wear headphones in public so i dont have to talk to anyone"
  );
  //responseObject.sendMethod(argument-bodyDataString) - converts and sends res jsObject as (http structure)response //content-type:text/plain});
  //thus ending request-response cycle
});

//if no method or path was matched for any (http structured) request then end request by sending (http structured) response ie res.send()
app.use((req, res) => {
  //responseObject.statusMethod(argument-numCode) returns responseObject with updated statusCode
  res.status(404).send("Not Found");
  //responseObject.sendMethod(argument-bodyDataString) - converts and sends res jsObject as (http structure)response //content-type:text/plain});
  //thus ending request-response cycle
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
