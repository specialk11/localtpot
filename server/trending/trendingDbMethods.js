const database = require('../mongoDB');
const db = new database.create('trending');
//Constant for summing values in a dictionary by using #sumValues(dict)#
const val = require('object.values');
const sumValues = obj => val(obj).reduce((a, b) => a + b);

module.exports = {
    getSearches,
    getMeals,
    getTrendingSearches,
    getTrendingMeals,
    getSpecials,
    insertMeal,
    insertSearch,
    insertSpecial,
    removeSpecials
}

//CHECK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSearches(cb) {
    const query = "recipes.searches"
    db.findOneSorted({"_id": "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "There is no recipe search info"
            }
            return cb(err);
        };
        return cb(null, data.recipes.searches);
    });
}

function getMeals(cb) {
    const query = "recipes.meals"
    db.findOneSorted({"_id": "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "There is no recipe meal info"
            }
            return cb(err);
        };
        return cb(null, data.recipes.meals);
    });
}

function getTrendingSearches(cb) {
    const query = "recipes.searches"
    db.findOneSorted({"_id": "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "There is no search info"
            }
            return cb(err);
        };
        const searchesDict = data.recipes.searches
        var totalSearches = sumValues(searchesDict)
        var trendingSearches = ["beer", "wine", "spirits", "cider", "noodles", "pizza"]
        var counter = 0
        keys = Object.keys(searchesDict)
        for (index in keys) {
            if (searchesDict[keys[index]] > totalSearches*0.05) {
                trendingSearches.push(keys[index])
            }
            counter += 1
            if (counter === keys.length) {
                return cb(null, trendingSearches);
            }
        };
    });
}

function getTrendingMeals(cb) {
    const query = "recipes.meals"
    db.findOneSorted({"_id": "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "There is no meal info"
            }
            return cb(err);
        };
        const mealsDict = data.recipes.meals
        var totalMeals = sumValues(mealsDict)
        var trendingMeals = ["beer", "wine", "spirits", "cider", "noodles", "pizza"]
        var counter = 0
        keys = Object.keys(mealsDict)
        for (index in keys) {
            if (mealsDict[keys[index]] > totalMeals*0.05) {
                trendingMeals.push(keys[index])
            }
            counter += 1
            if (counter === keys.length) {
                return cb(null, trendingMeals);
            }
        };
    });
}

function getSpecials(cb) {
    const query = "specials"
    db.findOneSorted({"_id": "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 404,
                "payload" : "There is no specials"
            }
            return cb(err);
        };
        return cb(null, data.specials);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Update
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertMeal(meal) {
    db.update({ "_id": "server"}, { "$inc" : {["recipes.meals." + meal] : 1}});
}

function insertSearch(search) {
    db.update({ "_id": "server"}, { "$inc" : {["recipes.searches." + search] : 1}});
}

function insertSpecial(shop, specials) {
    specialsUpdate = {
        ["specials." + shop] : { "$each": specials }
    }
    db.update({ "_id": "server"}, { "$addToSet" : specialsUpdate});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Remove
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeSpecials() {
   db.update({"_id": "server"},{"$set" : {"specials" : {}}})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////