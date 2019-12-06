var addVar = require("./addVariables");
var userInput = require("./out");


generateSchema = function() {
    console.log(addVar.getSchema());
    addVar.generateCollectionVariable();
};