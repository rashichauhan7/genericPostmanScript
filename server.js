var defaultScript = require("./defaultScript");
var userInput = require("./out");
var generateCall = require("./generateApiCalls");

generateSchema = function() {
    var schema = defaultScript;
    for(i in userInput.classes) {
        var name = userInput.classes[i];
        var call = generateCall.makeGetCall(name);
        call = generateCall.addCountTestToGetCall(call, name, userInput.data[name].length);
        schema = generateCall.addToScript(schema, call);
        schema = generateCall.makeDummyPostDeleteCall(name, userInput.schema[name], userInput.data[name].length, schema);
        schema = generateCall.makeCreatePostCall(name, userInput.data[name], schema);
        schema = generateCall.testGetCall(name, userInput.data[name], schema);
    }
        schema = generateCall.testRelationship(userInput.relationships.many_classes[0], userInput.data[userInput.relationships.many_classes[0]],
            schema,userInput.relationships.single_classes[0],userInput.relationships.single_classes[1]);
    return schema;
};

var fs = require("fs");
var fileContent = JSON.stringify(generateSchema());

fs.writeFile("./script.json", fileContent, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
