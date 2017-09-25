const database = require('../mongoDB');
const db = new database.create('users');
const uuid = require('uuid')


module.exports = {
    getWeek,
    getDay,
    insertItem,
    updateItem,
    removeItem
}

//CHECK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWeek(userId, weekStart, cb) {
    const query = "finance.weeks." + weekStart
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            //Initializes week
            const defaultWeek = {
                "total": 0,
                "income": 0,
                "expenditure": 0
            };
            db.update({"userId": userId}, {"$set": {[query] : defaultWeek}});
            return cb(null, {[weekStart] : defaultWeek})
        }
        return cb(null, data.finance.weeks)
    })
}

function getDay(userId, day, cb) {
    const query = "finance.days." + day
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            db.update({"userId": userId}, {"$set": {[query] : []}});
            return cb(null, [])
        }
        return cb(null, data.finance.days)
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Update
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateItem(userId, input, cb) {
    const query = "finance.weeks." + input.weekStart
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "There is no data for that week"
            }
            return cb(err)
        }
        const item = input.details
        //Updates given weeks total
        const week = data[query]
        const totalUpdate = {
            [query + ".total"]: week.total + parseFloat(item.amount)
        }
        db.update({"userId": userId}, {"$set": totalUpdate});

        //Checks to see if the amount is an income or expenditure
        if (parseFloat(item.amount) > 0) {
            const incomeUpdate = {
                [query + ".income"]: week.income + parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": incomeUpdate});
        } else {
            expenditureUpdate = {
                [query + ".expenditure"]: week.expenditure + parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": expenditureUpdate});
        }

        //Updates Day
        const dayQuery = "finance.days." + input.date + "."
        const dayUpdate = {
            [dayQuery + "$"] : item
        }
        db.update({"userId": userId, [dayQuery + "id"] : item.id}, {"$set": dayUpdate});

        return cb(null, {"status" : 200, "message" : "Item successfully updated"})
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertItem(userId, input, cb) {
    console.log(input)
    const query = "finance.weeks." + input.weekStart
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "There is no data for that week"
            }
            return cb(err)
        }
        const item = input.details
        //Updates given weeks total
        const week = data.finance.weeks[input.weekStart]
        const totalUpdate = {
            [query + ".total"]: week.total + parseFloat(item.amount)
        }
        db.update({"userId": userId}, {"$set": totalUpdate});

        //Checks to see if the amount is an income or expenditure
        if (parseFloat(item.amount) > 0) {
            const incomeUpdate = {
                [query + ".income"]: week.income + parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": incomeUpdate});
        } else {
            expenditureUpdate = {
                [query + ".expenditure"]: week.expenditure + parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": expenditureUpdate});
        }

        //Generates an id for the finance item
        item["id"] = uuid.v4()
        //Inserts Day
        const dayQuery = "finance.days." + input.date
        const dayUpdate = {
            [dayQuery] : item
        }
        db.update({"userId": userId}, {"$push": dayUpdate});

        return cb(null, {"status" : 200, "message" : "Item successfully inserted"})
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Remove
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeItem(userId, input, cb) {

    const weekQuery = "finance.weeks." + input.weekStart
    const dayQuery = "finance.days." + input.date

    db.findOneSorted({"userId": userId, [weekQuery] : { "$exists" : true }}, { [weekQuery] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "There is no data for that week"
            }
            return cb(err)
        }
        const item = input.details
        //Updates given weeks total
        const week = data.finance.weeks[input.weekStart]
        const totalUpdate = {
            [weekQuery + ".total"]: week.total - parseFloat(item.amount)
        }
        db.update({"userId": userId}, {"$set": totalUpdate});

        //Checks to see if the amount is an income or expenditure
        if (parseFloat(item.amount) > 0) {
            const incomeUpdate = {
                [weekQuery + ".income"]: week.income - parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": incomeUpdate});
        } else {
            expenditureUpdate = {
                [weekQuery + ".expenditure"]: week.expenditure - parseFloat(item.amount)
            }
            db.update({"userId": userId}, {"$set": expenditureUpdate});
        }

        const dayUpdate = {
            [dayQuery] : {"id" : item.id}
        }
        db.update({"userId" : userId}, {"$pull" : dayUpdate});

        return cb(null, {"status" : 200, "message" : "Item successfully removed"})
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////