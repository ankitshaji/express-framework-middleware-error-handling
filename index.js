//main file of this app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //functionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //appObject

// *******************************************
//Middleware(hook) function expressions and methods
// *******************************************
//Accept form data - expressFunctionObject.middlewareMethod() - (http structured) POST request body parsed to req.body
//(http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use() executes when any httpMethod/any httpStructured request arrives

//middlewareFunctionObject() - override req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE
//?queryString - (?key=value) therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use() executes when any httpMethod/any httpStructured request arrives

// *****************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters)
// *****************************************************************************************

//httpMethod=GET,path/resource-/(root) -(direct match/exact path)
//(READ) name-home,purpose-display home page
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/", (req, res) => {
  res.send("Here"); //send() - converts and sends res jsObject as (http structure)response //content-type:text/plain});
});
//httpMethod=GET,path/resource-/dogs -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (dogs)collection from (missing)db
//execute callback when (http structured) request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/dogs", async (req, res) => {
  res.send("Here"); //send() - converts and sends res jsObject as (http structure)response //content-type:text/plain
});

//address - localhost:3000
//appObject.method(port,callback) binds app to port
//execute callback when appObject start listening for (http structured) requests at port
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
