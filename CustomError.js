//user created module file - can contain functionObjects,variable,classObjects etc which we can export

//child ClassObject
//ClassObject.prototype = prototypeObject of this ClassObject
//extends keyword - sets __proto__ property of child ClassObject's instance object to parent ClassObject
//instance object therefore can now call methods in the parents ClassObjects prototypeObject

//customeErrorClassInstanceObject(child) inherits properties and methods from ErrorClassObject(parent)
class CustomError extends Error {
  //auto calls parent ErrorClassObject constructor method if one is not provided ie.ErrorClassObject("message")
  //which parent ErrorClassObject constructor is called is based on the number of arguments provided to child customeErrorClassInstanceObjects constructor

  constructor(message, status) {
    //this keyword - (execution scope/left of dot) ie.instance object - created from mandatory new keyword
    //super(message); //passing message as argument to parent ErrorClassObject constructor that takes 1 argument,it creates message property on CustomErrorInstanceObject due to inheritance
    super(); //calling ErrorClassObject constructor with no arguments
    //required for child customeErrorClassInstanceObject to inherit parent ErroClassObjects default/auto created properties/methods such as stack
    this.message = message; //ErrorClassObject's message property was not created due to empty constructor,therfore we create message property on CustomErrorInstanceObject
    this.status = status; //ErrorClassObject does not have a constructor that takes status,therfore we create status property on CustomErrorInstanceObject

    //express defaultErrorHandlerMiddlewareCallback
    //sets res.statusCode to customErrorInstanceObject.status and res.body to customErrorInstanceObject.message + customErrorInstanceObject.stack
    //if customErrorInstanceObject.status is undefined , it is auto sets to 500
    //res.statusMessage is auto set from customErrorInstanceObject.status
    //before making the (http structured) response
  }
}

//exportObject = customeErrorClassInstanceObject
module.exports = CustomError;
