//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Product = require("./models/product"); //productClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module

// ********************************************************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// ********************************************************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
mongoose
  .connect("mongodb://localhost:27017/farmStanddb2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //promisObject resolved
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    //promisObject rejected
    console.log("Mongo connection error has occured");
    console.log(err);
  });
//Dont need to nest code inside callback - Operation Buffering
//mongoose lets us use models immediately,without wainting
//for mongoose to eastablish a connection to MongoDB

//when view engine is used express assumes our views ie ejs templates
//exist in a (default)views directory
app.set("view engine", "ejs"); //auto require("ejs")
//change path to absolute path to index.js
app.set("views", path.join(__dirname, "/views"));

//middlewareFunctionObject() - override req.method from eg.POST to value of _method key eg.PUT,PATCH,DELETE
//?queryString - (?key=value) therefore _method is key, we set value to it in html form
app.use(methodOverride("_method")); //app.use() executes when any httpMethod/any httpStructured request arrives

//Accept form data - expressFunctionObject.middlewareMethod() - (http structured) POST request body parsed to req.body
//(http structure) POST request could be from browser form or postman
app.use(express.urlencoded({ extended: true })); //app.use() executes when any httpMethod/any httpStructured request arrives

//variable to pass into forms -
//iterate over array to dynamically create option elements in a selection element of a form element
const categories = ["fruit", "vegetable", "dairy"]; //arrayObject

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//httpMethod=GET,path/resource-/products + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products", async (req, res) => {
  //object keys to variable - Object destructuring
  const { category } = req.query; //queryStringObject
  // *****************************************************
  //READ - querying a collection for a document/documents
  // *****************************************************
  //productClassObject.method(queryObject) ie modelClassObject.method() - same as - db.products.find({})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //check if ?queryString exists ,undefined is false
  if (category) {
    const products = await Product.find({ category: category }); //products = dataObject ie array of all jsObjects(documents) that have the same category value
    res.render("products/index", { products: products, category: category }); //(ejs filePath,variable sent to ejs)
  } else {
    const products = await Product.find({}); //products = dataObject ie array of all jsObjects(documents)
    res.render("products/index", { products: products, category: "All" }); //(ejs filePath,variable sent to ejs)
  }
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//(http stuctured) GET request to form path - (http structured) response is pure html converted from form ejs file
//httpMethod=GET,path/resource-/products/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (products)collection of (farmStanddb)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories: categories }); //(ejs filePath,variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=POST,path/resource-/products  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (products)collection of (farmStanddb)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//http structured request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.post("/products", async (req, res) => {
  // ***************************************************************************************
  //CREATE - creating a single new document in the (products) collection of (farmStanddb)db
  // ***************************************************************************************
  //modelClass
  //productClassObject(objectArgument-passed to constructor method)
  //objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
  //objectArgument has validations/contraints set by collectionSchemaInstanceObject
  //validations/contraints -
  ///cannot ommit name property,cannot ommit price property, price gets converted to type number, addtional key:values get neglected(no error)
  //price min val 0,setting (atomicValue)customEnumType with pre fixed values category needs to use eg.(booleanEnumType takes true,false)
  //but here enum validator is of type string array with pre fixed values category needs to use,category needs to be lowercase
  //create modelInstanceObject(ie document) - with new keyword and productClassObject constructor method
  const newProduct = new Product(req.body); //form data/req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  //modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //creates (products)collection in (farmStanddb)db and adds (newProduct)document into the (products)collection
  const savedProduct = await newProduct.save(); //savedProduct = dataObject ie created jsObject(document)
  //fix for page refresh sending duplicate http structured post request -
  res.redirect(`/products/${newProduct._id}`);
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /products/:id
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) get request to location ie default(get)/products/:id
});

//httpMethod=GET,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (products)collection of (farmStanddb)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products/:id", async (req, res) => {
  //could use productName if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  const product = await Product.findById(id); //product = dataObject ie single first matching jsObject(document)
  res.render("products/show", { product: product }); //(ejs filePath,variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//(http stuctured) GET request to form path - (http structured) response is pure html converted from form ejs file
//httpMethod=GET,path/resource-/products/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (products)collection of (farmStanddb)db
//execute callback when http structure request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products/:id?/edit", async (req, res) => {
  //could use productName if it was webSlug(url safe)
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ***********************************************************
  //READ - querying a collection(products) for a document by id
  // ***********************************************************
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOne({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  const foundProduct = await Product.findById(id); //foundProduct = dataObject ie single first matching jsObject(document)
  //passing in foundProduct to prepoppulate form
  res.render("products/edit", {
    product: foundProduct,
    categories: categories,
  }); //(ejs filePath,renamed variable sent to ejs)
  //render() - executes js - converts  ejs file into pure html
  //render() - converts and sends res jsObject as (http structure)response //content-type:text/html
});

//httpMethod=PUT,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (products)collection of (farmStanddb)db
//execute callback when (http structure) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//(http structured) request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.put("/products/:id", async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  //form data ie req.body is jsObject {key/name:inputValue,key/name:inputValue,key/name:inputValue}
  // **************************************************************************************************************
  //UPDATE - querying a collection(products) for a document by id then updating it + new key:value pairs neglected
  // **************************************************************************************************************
  //modelClass
  //productClassObject.method(idString,updateObject,optionObject) ie modelClassObject.method() - same as - db.products.findOneAndUpdate(({_id:"12345"},{$set:{name:"x",...}},{returnNewDocument:true})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject) ie(breaking validation/contraints)
  //To run validations/contraints when updating we need to set runValidators(key) in optionsObject
  //To get the jsObject(document) after update, we need to set new(key) in optionsObject
  //queries (products)collection of (farmStanddb)db for single document by idString and updates/replaces the document with new updateObject(document)
  const foundProduct = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  }); //foundProduct = dataObject ie single first matching jsObject(document) after it was updated
  //fix for page refresh sending duplicate (http structured) PUT request -
  res.redirect(`/products/${foundProduct._id}`);
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /products/:id
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) get request to location ie default(get)/products/:id
});

//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb)db
//execute callback when (http structure) request arrives
//convert (http structured) request to req jsObject + create res jsObject
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.delete("/products/:id", async (req, res) => {
  //object keys to variable - Object destructuring
  const { id } = req.params; //pathVariablesObject
  // ******************************************************************************
  //DELETE - querying a collection(products) for a document by id then deleting it
  // ******************************************************************************
  //modelClass
  //productClassObject.method(idString) ie modelClassObject.method() - same as - db.products.findOneAndDelete(({_id:"12345"})
  //returns thenableObject - pending to resolved(dataObject),rejected(errorObject)
  //queries (products)collection of (farmStanddb)db for single document by idString and deletes the document
  const deletedProduct = await Product.findByIdAndDelete(id); //deletedProduct = dataObject ie single first matching jsObject(document) that was deleted
  //fix for page refresh sending duplicate (http structured) DELETE request -
  res.redirect("/products");
  //console.dir(res._header); //res.statusCode set to 302-found ie redirect //res.location set to /products
  //converts and sends res jsObject as (http structure)response //default content-type:text/html
  //browser sees (http structured) response with headers and makes a (http structured) get request to location ie default(get)/products
});

//adddress - localhost:3000
//app is listening for (HTTPstructured) requests
//executes callback
app.listen(3000, () => {
  console.log("listning on port 3000;");
});
