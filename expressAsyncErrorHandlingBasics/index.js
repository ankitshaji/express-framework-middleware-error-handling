//main file of an app that gets other npm package modules or user created modules

//RESTful webApi - using REST principles
const express = require("express"); //FunctionObject //express module
const path = require("path"); //pathObject //path module
const app = express(); //AppObject
//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module
const Product = require("./models/product"); //productClassObject(ie Model) //self created module/file needs "./"
const methodOverride = require("method-override"); //functionObject //method-override module
const CustomErrorClassObject = require("../CustomError"); //CustomErrorClassObject //self created module/file needs "./" , going back a directory ..
//mongooseObject.property = objectLiteral
const ObjectID = mongoose.Types.ObjectId; //functionObject

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
//variable to pass into forms -
const categories = ["fruit", "vegetable", "dairy"];

// *********************************************************************************************************************************************************
//RESTful webApi crud operations pattern (route/pattern matching algorithm - order matters) + MongoDB CRUD Operations using mongoose-ODM (modelClassObject)
// *********************************************************************************************************************************************************

//httpMethod=GET,path/resource-/products + can contain ?queryString  -(direct match/exact path)
//(READ) name-index,purpose-display all documents in (products)collection from (farmStanddb)db
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products", async (req, res, next) => {
  //try/catch
  try {
    const { category } = req.query;
    // *****************************************************
    //READ - querying a collection for a document/documents
    // *****************************************************
    if (category) {
      //if mongooseMethod .find() throws new Error("messageFromMongoose")
      //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
      //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
      //UnhandledPromiseRejection occurs if not caught
      const products = await Product.find({ category: category });
      res.render("products/index", { products: products, category: category });
    } else {
      //if mongooseMethod .find() implicitly throws new Error("messageFromMongoose")
      //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
      //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
      //UnhandledPromiseRejection occurs if not caught
      const products = await Product.find({});
      res.render("products/index", { products: products, category: "All" });
    }
  } catch (e) {
    //the errorInstanceObject was caught here - e
    //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    next(e);
  }
});

//httpMethod=GET,path/resource-/products/new  -(direct match/exact path)
//(READ) name-new,purpose-display form to submit new document into (products)collection of (farmStanddb)db
app.get("/products/new", (req, res) => {
  //explicitly throw an error in middlewareCallback
  //CustomErrorClassObject("message",statusCode) //sends arguments to constructor method //new keyword creates customErrorClassInstanceObject
  throw new CustomErrorClassObject("Not Allowed", 401);
  //implicite next(customErrorClassInstanceObject) passes customErrorClassInstanceObject to next errorHandlerMiddlewareCallback
  res.render("products/new", { categories: categories });
});

//httpMethod=POST,path/resource-/products  -(direct match/exact path)
//(CREATE) name-create,purpose-create new document in (products)collection of (farmStanddb)db
//http structured request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.post("/products", async (req, res, next) => {
  // ***************************************************************************************
  //CREATE - creating a single new document in the (products) collection of (farmStanddb)db
  // ***************************************************************************************
  //try/catch
  try {
    const newProduct = new Product(req.body);
    //break validation contraints
    //if mongooseMethod .save() implicitly throws new Error("messageFromMongoose")
    //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
    //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
    //UnhandledPromiseRejection occurs if not caught
    const savedProduct = await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    //the errorInstanceObject was caught here - e
    //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    next(e);
  }
});

//httpMethod=GET,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(READ) name-show,purpose-display single specific document in (products)collection of (farmStanddb)db
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  //if check - true(validIdFormat)
  if (!ObjectID.isValid(id)) {
    //create customErrorClassInstanceObject - new CustomeErrroClassObject("message",status)
    //explicitly call next(customErrorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    //we return to escape the handlerMiddlewareCallback and prevent rest of code from executing
    return next(
      new CustomErrorClassObject("Invalid Id passed into mongooseMethod", 400)
    );
  }
  // *************************************************
  //READ - querying a collection for a document by id
  // *************************************************
  const product = await Product.findById(id);
  //invalid ObjectId format/length to mongooseMethod
  //if mongooseMethod .findById() implicitly throws new Error("messageFromMongoose")
  //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
  //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
  //UnhandledPromiseRejection occurs if not caught
  //note- one fix is to to check id before passing to mongooseMethod

  //if mongoseMethod .findId() does not throw new Error("messageFromMongoose")
  //but product value is null - auto set by mongodb
  //if check - false(null)
  if (!product) {
    //create customErrorClassInstanceObject - new CustomeErrroClassObject("message",status)
    //explicitly call next(customErrorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    //we return to escape the handlerMiddlewareCallback and prevent rest of code from executing
    return next(new CustomErrorClassObject("Product not found", 404));
  }
  //if we reach this code it throws new Error("ejsErrorMessage")
  //ejs trying to call a null  valued variables property
  //UnhandledPromiseRejection occurs if not caught
  res.render("products/show", { product: product });
});

//alternative - try/catch - don't need to "return" next(new CustomErrorClassOjbect("message",status))
// app.get("/products/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectID.isValid(id)) {
//       //explicitly throws new Error("message",status)
//       //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//       //this errorInstanceObject is caught in the closes catch , this could be try/catch or .catch(()=>{})
//       //UnhandledPromiseRejection occurs if not caught
//       throw new AppError("Invalid Id", 400);
//     }
//     const product = await Product.findById(id); ///WORDS HERER
//     //invalid ObjectId format/length to mongooseMethod
//     //if mongooseMethod .findById() implicitly throws new Error("messageFromMongoose")
//     //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//     //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
//     //UnhandledPromiseRejection occurs if not caught
//     //note- one fix is to to check id before passing to mongooseMethod

//     //if mongoseMethod .findId() does not throw new Error("messageFromMongoose")
//     //but product value is null - auto set by mongodb
//     //if check - false(null)
//     if (!product) {
//       //explicitly throws new Error("message",status)
//       //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//       //this errorInstanceObject is caught in the closes catch , this could be try/catch or .catch(()=>{})
//       //UnhandledPromiseRejection occurs if not caught
//       throw new AppError("Product Not Found", 404);
//     }
//     res.render("products/show", { product });
//   } catch (e) {
//     next(e);
//     //the errorInstanceObject was caught here - e
//     //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
//     //we must pass have nextCallback as parameter
//   }
// });

//httpMethod=GET,path/resource-/products/:id/edit  -(pattern match) //:id is a path variable
//(READ) name-edit,purpose-display form to edit existing document in (products)collection of (farmStanddb)db
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.get("/products/:id?/edit", async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    //create customErrorClassInstanceObject - new CustomeErrroClassObject("message",status)
    //explicitly call next(customErrorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    //we return to escape the handlerMiddlewareCallback and prevent rest of code from executing
    return next(
      new CustomErrorClassObject("Invalid Id passed into mongooseMethod", 400)
    );
  }
  // ***********************************************************
  //READ - querying a collection(products) for a document by id
  // ***********************************************************
  const foundProduct = await Product.findById(id);
  //invalid ObjectId format/length to mongooseMethod
  //if mongooseMethod .findById() implicitly throws new Error("messageFromMongoose")
  //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
  //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
  //UnhandledPromiseRejection occurs if not caught
  //note- one fix is to to check id before passing to mongooseMethod

  //if mongoseMethod .findId() does not throw new Error("messageFromMongoose")
  //but foundProduct value is null - auto set by mongodb
  //if check - false(null)
  if (!foundProduct) {
    //create customErrorClassInstanceObject - new CustomeErrroClassObject("message",status)
    //explicitly call next(customErrorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
    //we return to escape the handlerMiddlewareCallback and prevent rest of code from executing
    return next(new CustomErrorClassObject("Product not found", 404));
  }
  res.render("products/edit", {
    product: foundProduct,
    categories: categories,
  });
});

//alternative - try/catch - don't need to "return" next(new CustomErrorClassOjbect("message",status))
// app.get("/products/:id?/edit", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     if (!ObjectID.isValid(id)) {
//       //explicitly throws new Error("message",status)
//       //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//       //this errorInstanceObject is caught in the closes catch , this could be try/catch or .catch(()=>{})
//       //UnhandledPromiseRejection occurs if not caught
//       throw new CustomErrorClassObject(
//         "Invalid Id passed into mongooseMethod",
//         400
//       );
//     }
//     // ***********************************************************
//     //READ - querying a collection(products) for a document by id
//     // ***********************************************************
//     const foundProduct = await Product.findById(id);
//     //invalid ObjectId format/length to mongooseMethod
//     //if mongooseMethod .findById() implicitly throws new Error("messageFromMongoose")
//     //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//     //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
//     //UnhandledPromiseRejection occurs if not caught
//     //note- one fix is to to check id before passing to mongooseMethod

//     //if mongoseMethod .findById() does not throw new Error("messageFromMongoose")
//     //but foundProduct value is null - auto set by mongodb
//     //if check - false(null)
//     if (!foundProduct) {
//       //explicitly throws new Error("message",status)
//       //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
//       //this errorInstanceObject is caught in the closes catch , this could be try/catch or .catch(()=>{})
//       //UnhandledPromiseRejection occurs if not caught
//       throw new CustomErrorClassObject("Product not found", 404);
//     }
//     res.render("products/edit", {
//       product: foundProduct,
//       categories: categories,
//     });
//   } catch (e) {
//     next(e);
//     //the errorInstanceObject was caught here - e
//     //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
//     //we must pass have nextCallback as parameter
//   }
// });

//httpMethod=PUT,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(UPDATE) name-update,purpose-completely replace/update single specific existing document in (products)collection of (farmStanddb)db
//(http structured) request body contains data - middleware parses to req.body
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.put("/products/:id", async (req, res, next) => {
  //try/catch
  try {
    const { id } = req.params;
    // **************************************************************************************************************
    //UPDATE - querying a collection(products) for a document by id then updating it + new key:value pairs neglected
    // **************************************************************************************************************
    //invalid ObjectId format/length or break validation constraints to mongooseMethod
    //if mongooseMethod .findByIdAndUpdate() implicitly throws new Error("messageFromMongoose")
    //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
    //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
    //UnhandledPromiseRejection occurs if not caught
    //note- one fix is to to check id before passing to mongooseMethod
    const foundProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${foundProduct._id}`);
  } catch (e) {
    next(e);
    //the errorInstanceObject was caught here - e
    //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
  }
});

//httpMethod=DELETE,path/resource-/products/:id  -(pattern match) //:id is a path variable
//(DELETE) name-destroy,purpose-delete single specific document in (products)collection of (farmStanddb)db
//async(ie continues running outside code if it hits an await inside) callback implicit returns promiseObject(resolved,undefined) - can await a promiseObject inside
//async function expression without an await is just a normal syncronous function expression
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // ******************************************************************************
    //DELETE - querying a collection(products) for a document by id then deleting it
    // ******************************************************************************
    const deletedProduct = await Product.findByIdAndDelete(id);
    //invalid ObjectId format/length or break validation constraints to mongooseMethod
    //if mongooseMethod .findByIdAndDelete() implicitly throws new Error("messageFromMongoose")
    //it creates a new errorInstanceObject + causes promiseObject to be rejectd(errorInstanceObject)
    //this errorInstance is caught in the closes catch , this could be try/catch or .catch(()=>{})
    //UnhandledPromiseRejection occurs if not caught
    //note- one fix is to to check id before passing to mongooseMethod

    res.redirect("/products");
  } catch (e) {
    next(e);
    //the errorInstanceObject was caught here - e
    //then we explicitly call next(errorClassInstanceObject) to pass it to next errorHandlerMiddleareCallback
    //we must pass have nextCallback as parameter
  }
});

// ************************************
//customErrorHandlerMiddlewareCallback
// ************************************
//app.use(customErrorHandlerMiddlewareCallback)
//customErrorHandlerMiddlewareCallback takes in 4 arguments -(errorClassInstanceObject/customErrorClassInstanceObject,resObject,reqObject,nextCallback)
app.use((err, req, res, next) => {
  //customeErrorClassInstanceObject has property status, errorClassInstanceObject's status property is undefined
  //both instances have a message property + other methods and properties such as stack
  //key to variable + set default values if undefined - object destructuring
  const { status = 500, message = "Something went wrong" } = err; //errorClassInstanceObject
  res.statusMessage = "I can edit this instead of being auto set from status";
  //we need to redirect if its an error thrown from patch/post/delete request
  res.status(status).send(message); //convert responseObject and send (http structured) response - ending request-response cycle
  //next(errorClassInstanceObject); //could pass errorClassInstanceObject to defaultErrorHandlerMiddlewareCallback(invisible)
});

//**************************************************
//INVISIBLE - defaultErrorHandlerMiddlewareCallback
//**************************************************

//adddress - localhost:3000
//app is listening for (HTTPstructured) requests
//executes callback
app.listen(3000, () => {
  console.log("listning on port 3000;");
});
