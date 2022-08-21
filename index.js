//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject
const morgan = require("morgan"); //functionObject //morgan module
const methodOverride = require("method-override"); //functionObject //method-override module

// ********************************************************************************************
//External middleware(hook) function expressions and express built in middleware(hook)methods
// ********************************************************************************************

//app.use(argument) - argument is anycode, anycode is treated as middleware(hook) function
//Tells expressApp to use the returned functionObject during any/every request
// app.use(() => {
//   console.log("Waiting without responding back or moving on"); //option1 -end request by responding option2-move onto next middleware(hook) function
// }); //app.use(middlewareCallback) executes middlewareCallback when any httpMethod/any httpStructured request arrives

//(External)middlewareFunctionObject() - log (http structured) request info into shell before responding or moving to next middleware
//middwareFunction(argument)-argument can be custom string ":method :url :status :res[content-length] - :response-time ms"
//statusCode -304 Not Modified is similar to 200 ok
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
); //app.use(middlwareFunctionExecution = functionObject) execute functionObject when any httpMethod/any httpStructured request arrives
//functionObject tells it to move onto next middleware or route

//(External)middlewareFunctionObject() - override req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE before responding or moving to next middleware
//?queryString - (?key=value) therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use(middlwareFunctionExecution=functionObject) executes functionObject when any httpMethod/any httpStructured request arrives
//functionObject tells it to move onto next middleware or route

//(express built in method) Accept form data - expressFunctionObject.middlewareMethod() - (http structured) POST request body parsed to req.body before responding or moving to next middleware
//(http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use(middlwareMethodExecution=functionObject) execute functionObject when any httpMethod/any httpStructured request arrives
//functionObject tells it to move onto next middleware or route

//(express built in method) Accept json data - expressFunctionObject.middlewareMethod() - (http structured) POST request body parsed to req.body before responding or moving to next middleware
//(http structure) POST request from postman
app.use(express.json()); //app.use(middlwareMethodExecution=functionObject) execute functionObject when any httpMethod/any httpStructured request arrives
//functionObject tells it to move onto next middleware or route

//(express built in method) Accept static data - expressFunctionObject.middlewareMethod() - get files before responding or moving to next middleware
//app.use(express.static("staticFileDirectory")); //app.use(middlwareMethodExecution=functionObject) execute functionObject when any httpMethod/any httpStructured request arrives
//functionObject tells it to move onto next middleware or route

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//route1
//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/", (req, res) => {
  //res.set("content-type", "text/plain");
  res.send("Home Page"); //send() - converts and sends res jsObject as (http structure)response //content-type:text/plain});
});

//route2
//httpMethod=GET,path/resource-/dogs -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (dogs)collection from (missing)db
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/dogs", async (req, res) => {
  res.send("Dogs Page"); //send() - converts and sends res jsObject as (http structure)response //content-type:text/plain
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
