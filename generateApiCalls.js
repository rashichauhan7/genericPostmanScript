var rand = require("random-int");
function makeGetCall(className) {
    var call = {};
    call["name"] = "Verify number of " + className;
    call["request"] = {
        "url": "http://localhost:3000/api/" + className,
        "method": "GET",
        "header": [
            {
                "description": "",
                "key": "Content-Type",
                "name": "Content-Type",
                "type": "text",
                "value": "application/json"
            }
        ],
        "body": {
            "mode": "raw",
            "raw": ""
        },
        "description": ""
    };
    return call;
}

function addCountTestToGetCall(call, className, count) {
    call["event"] = [
        {
            "listen": "test",
            "script": {
                "type": "text/javascript",
                "exec": [
                    "pm.test(\"Verify No "+className+"\", function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data.length).to.eql("+count+");",
                    "});"
                ]
            }
        }
    ];
    return call;
}

function addToScript(schema, call) {
    call["response"] = [];
    schema["item"].push(call);
    return schema;
}

function makeDummyPostDeleteCall(name, scheme, count, schema) {
    var call = {};
    var id = rand(100000,999999);
    call["name"] = "Create dummy "+name;
    var data = {};
    for(var field in scheme) {
        if(scheme[field][1] == "integer") {
            data[scheme[field][0]] = id;
        }
        if(scheme[field][1] == "string") {
            data[scheme[field][0]] = "dummy";
        }
        if(scheme[field][1] == "boolean") {
            data[scheme[field][0]] = true;
        }
    }
    call["request"] = {
        "url": "http://localhost:3000/api/" + name,
        "method": "POST",
        "header": [
            {
                "description": "",
                "key": "Content-Type",
                "name": "Content-Type",
                "type": "text",
                "value": "application/json"
            }
        ],
        "body": {
            "mode": "raw",
            "raw": data
        },
        "description": ""
    };
    call = addCountTestToGetCall(call, name, count + 1);
    schema = addToScript(schema, call);
    call = {};
    call["name"] = "Delete Dummy "+ name;
    call["request"] = {
        "url": "http://localhost:3000/api/" + name +"/"+id,
        "method": "DELETE",
        "header": [
        {
            "description": "",
            "key": "Content-Type",
            "name": "Content-Type",
            "type": "text",
            "value": "application/json"
        }
    ],
        "body": {
        "mode": "raw",
            "raw": ""
    },
        "description": ""
    };
    call = addCountTestToGetCall(call, name, count - 1);
    schema = addToScript(schema, call);
    return schema;
}

function makeCreatePostCall(name, data, schema) {
    for (var entry in data){
        var call = {};
        call["name"] = "Create " + name + " " + data[entry]["_id"];
        call["request"] = {
            "url": "http://localhost:3000/api/"+name,
            "method": "POST",
            "header": [
                {
                    "key": "Content-Type",
                    "name": "Content-Type",
                    "value": "application/json",
                    "description": "",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": data[entry]
            },
            "description": ""
        };
        schema = addToScript(schema, call);

    }
    return schema;
}


function testGetCall(name, data, schema) {
    for (var entry in data){
        var call = {};
        call["name"] = "Verify " + name + " " + data[entry]["_id"];
        call["request"] = {
            "url": "http://localhost:3000/api/"+name+ "/"+data[entry]["_id"],
            "method": "GET",
            "header": [
                {
                    "key": "Content-Type",
                    "name": "Content-Type",
                    "value": "application/json",
                    "description": "",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": ""
            },
            "description": ""
        };
        call["event"] = [
            {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "exec": [
                        "pm.test(\"Verify\", function () {",
                        "    var charlie = pm.response.json();",
                        "    pm.expect(charlie).to.eql(JSON.parse("+JSON.stringify(data[entry])+"));",
                        "});",
                        ""
                    ]
                }
            }
        ];
        schema = addToScript(schema, call);

    }
    return schema;
}

function testManyClass(name, data, schema) {
    for (var entry in data){
        var call = {};
        call["name"] = "Verify " + name + " " + data[entry]["_id"];
        call["request"] = {
            "url": "http://localhost:3000/api/"+name+ "/"+data[entry]["_id"],
            "method": "GET",
            "header": [
                {
                    "key": "Content-Type",
                    "name": "Content-Type",
                    "value": "application/json",
                    "description": "",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": ""
            },
            "description": ""
        };
        call["event"] = [
            {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "exec": [
                        "pm.test(\"Verify\", function () {",
                        "    var charlie = pm.response.json();",
                        "    var obj = "+JSON.stringify(data[entry])+"",
                        "    pm.expect(charlie[0].toString()).to.eql(obj.toString());",
                        "});",
                        ""
                    ]
                }
            }
        ];
        schema = addToScript(schema, call);

    }
    return schema;
}

function testRelationship(name, data, schema, class1, class2) {
    for (var entry in data){
        var call = {};
        call["name"] = "1. Verify relationship for " + name + " " + data[entry]["_id"];
        call["request"] = {
            "url": "http://localhost:3000/api/"+class1+"/"+data[entry][class1]+"/"+class2+"/"+data[entry][class2]+"/"+name,
            "method": "GET",
            "header": [
                {
                    "key": "Content-Type",
                    "name": "Content-Type",
                    "value": "application/json",
                    "description": "",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": ""
            },
            "description": ""
        };
        call["event"] = [
            {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "exec": [
                        "pm.test(\"Verify\", function () {",
                        "    var charlie = pm.response.json();",
                        "    var obj = "+JSON.stringify(data[entry])+"",
                        "    pm.expect(charlie[0].toString()).to.eql(obj.toString());",
                        "});",
                        ""
                    ]
                }
            }
        ];
        schema = addToScript(schema, call);
        call = {};
        call["name"] = "2. Verify relationship for " + name + " " + data[entry]["_id"];
        call["request"] = {
            "url": "http://localhost:3000/api/"+class2+"/"+data[entry][class2]+"/"+class1+"/"+data[entry][class1]+"/"+name,
            "method": "GET",
            "header": [
                {
                    "key": "Content-Type",
                    "name": "Content-Type",
                    "value": "application/json",
                    "description": "",
                    "type": "text"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": ""
            },
            "description": ""
        };
        call["event"] = [
            {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "exec": [
                        "pm.test(\"Verify\", function () {",
                        "    var charlie = pm.response.json();",
                        "    var obj = "+JSON.stringify(data[entry])+"",
                        "    pm.expect(charlie[0].toString()).to.eql(obj.toString());",
                        "});",
                        ""
                    ]
                }
            }
        ];
        schema = addToScript(schema, call);
    }
    return schema;
}

module.exports = {
    makeGetCall,
    addCountTestToGetCall,
    addToScript,
    makeDummyPostDeleteCall,
    makeCreatePostCall,
    testGetCall,
    testRelationship
};