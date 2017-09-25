const database = require('../mongoDB');
const db = new database.create('users');
const uuid = require('uuid')

module.exports = {
    getFavourites,
    getDay,
    insertFavourite,
    insertMeal,
    removeFavourite,
    removeMeal
}

//CHECK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getFavourites(userId, cb) {
    const query = "recipes.favourites"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "No favourites found"
            }
            return cb(err)
        }
        return cb(null, data.recipes.favourites)
    })
}

function getDay(userId, date, cb) {
    const query = "recipes.meals." + date
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            db.update({"userId": userId}, {"$set": {[query] : []}});
            return cb(null, [])
        }
        return cb(null, data.recipes.meals[date])
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Update
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertFavourite(userId, input) {
    const favouritesUpdate = {
        "recipes.favourites": input
    }
    db.update({ "userId": userId}, { "$addToSet": favouritesUpdate});
}

function insertMeal(userId, date, input) {
    const mealUpdate = {
        ["recipes.meals." + date] : input
    }
    input["id"] = uuid.v4()
    db.update({ "userId": userId}, { "$addToSet" : mealUpdate});
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Remove
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeFavourite(userId, input) {
    const favouritesUpdate = {
        "recipes.favourites": input
    }
    db.update({"userId":userId}, {"$pull":favouritesUpdate});
}

function removeMeal(userId, date, meal) {
    const query = "recipes.meals." + date
    const mealUpdate = {
        [query] : {"id" : meal.id}
    }
    console.log({"userId" : userId}, {"$pull" : mealUpdate})
    console.log(mealUpdate)
    db.update({"userId" : userId}, {"$pull" : mealUpdate});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////