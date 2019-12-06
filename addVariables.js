var schema = require("./defaultScript");
var uniqid = require('uniqid');
function generateCollectionVariable(name, value, type) {
    var id =  uniqid();
    var variable = {
        "id": id,
        "key": name,
        "value": value,
        "type": type
    };
    return variable;
}

function addVariableToSchema(variable) {
    schema.variable.push(variable);
}

function getSchema() {
    return schema;
}

module.exports = {
    generateCollectionVariable,
    addVariableToSchema,
    getSchema
};
