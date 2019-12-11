import itertools
import json
classCount = input("Enter the number of classes")
names = []
for i in range(0, classCount):
    print("Enter %i class name:" %(i+1))
    name = raw_input()
    names.append(name)

singleClass = set()
manyClass = set()
print("Enter the relationship of every 2 classes For 1:1 enter 1:1,"
      " for 1:Many enter 1:N, for Many:1 enter N:1")
for combi in (list(itertools.combinations(names,2))):
    print (combi)
    print(type(combi))
    relation = raw_input()
    if relation == "1:1":
        singleClass.add(combi[0])
        singleClass.add(combi[1])

    if relation == "1:N":
        singleClass.add(combi[0])
        manyClass.add(combi[1])

    if relation == "N:1":
        singleClass.append(combi[1])
        manyClass.append(combi[0])

singleClass = list(singleClass)
manyClass = list(manyClass)

schema = {}
for i in range(0, classCount):
    fields = []
    print ("Enter number of fields for %s" %names[i])
    for j in range(0, input()):
        tuple = []
        tuple.append(raw_input("Enter field name:"))
        tuple.append(raw_input("Enter field type string, integer, boolean, string[], integer[] or date?"))
        fields.append(tuple)
    schema[names[i]] = fields

#print(schema)
data = {}
for i in range(0, classCount):
    print("Enter number of entries for %s" %names[i])
    data[names[i]] = []

    for j in range(0, input()):
        values = {}
        for k in range(0, len(schema[names[i]])):
            print(schema[names[i]][k])
            if schema[names[i]][k][1] == "integer":
                values[schema[names[i]][k][0]] = input()
            if schema[names[i]][k][1] == "boolean":
                values[schema[names[i]][k][0]] = True if raw_input() == "true" else False
            if schema[names[i]][k][1] == "string" or schema[names[i]][k][1] == "date":
                values[schema[names[i]][k][0]] = raw_input()
            if schema[names[i]][k][1] == "string[]" or schema[names[i]][k][
                1] == "integer[]":
                print("Enter json string with brackets")
                values[schema[names[i]][k][0]] = json.loads(raw_input())
        data[names[i]].append(values)

#print(data)

jsondump = {}
jsondump["classes"] = names
jsondump["relationships"] = { "single_classes": singleClass, "many_classes": manyClass}
jsondump["schema"] = schema
jsondump["data"] = data

print jsondump
json.dump(jsondump, open("output.json","w"))

