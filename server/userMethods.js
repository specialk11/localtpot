const database = require('./mongoDB');
const db = new database.create('users');

module.exports = {
    checkUser,
    checkEvent,
    createUser,
    getAllUserIds,
    getUser,
    getTokens,
    getBasicInfo,
    getCalendarList,
    getCalendars,
    getEvent,
    getRecipes,
    getFinance,
    getSettings,
    getCalendarSettings,
    getCollegeSettings,
    updateOauth,
    updateCalendarListSyncToken,
    updateCalendarList,
    updateCalendarSyncToken,
    updateEventListSyncToken,
    updateAccessToken,
    updateSettings,
    updateCourse,
    insertEvent,
    insertNewCalendarListItem,
    insertSetting,
    insertSocieties,
    removeUser,
    removeEvent,
    removeSociety,
    insertCalendarList,
    insertEventList
}

//CHECK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkUser(userId, cb) {
    db.findOne({"userId": userId}, data => {
        if (!data) {
            const err = {
                "error" : 401,
                "payload" : "User does not exist"
            }
            return cb(err);
        };
        return cb(null);
    });
}

function checkEvent(userId, calendarId, eventId, cb){
    db.findOne({ "userId": userId, "calendars.id": calendarId, "calendars.$.items.id": eventId}, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Event does not exist"
            }
            return cb(err);
        };
        return cb(null);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createUser(tokens, input) {
    db.insert({
        "userId" : input.sub,
        "tokens" : tokens,
        "basicInfo" : input,
        "oAuth" : "",
        "calendarList" : [],
        "calendars" : [],
        "recipes" : {
            "meals" : {},
            "favourites" : []
        },
        "finance" : {
            "weeks" : {},
            "days" : {}
        },
        "settings" : {
            "account" : {
                "firstName" : input.given_name,
                "secondName" : input.family_name,
                "email" : input.email,
                "photo" : ""
            },
            "calendars" : [
                //email : true
            ],
            "cuisine" : {
                "diet" : {
                    "vegan" : false,
                    "vegetarian" : false,
                    "pescetarian" : false,
                    "lacto vegetarian" : false,
                    "ovo vegetarian" : false
                },
                "intolerances" : {
                    "dairy" : false,
                    "egg" : false,
                    "gluten" : false,
                    "peanut" : false,
                    "sesame" : false,
                    "seafood" : false,
                    "shellfish" : false,
                    "soy" : false,
                    "sulfite" : false,
                    "tree nut" : false,
                    "wheat" : false
                }
            },
            "course" : {
                "name" : "",
                "year" : "",
                "college" : "",
                "modules" : [
                    //{"Linear Algebra" : false}
                ]
            },
            "societies" : [
                //"Basketball"
            ]
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAllUserIds(cb) {
    db.findSorted({}, {"userId": -1}, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "There are no users"
            }
            return cb(err);
        };
        return cb(null, data);
    });
}

function getUser(userId, cb){
    db.findOne({"userId": userId}, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not exist"
            }
            return cb(err);
        };
        return cb(null, data);
    });
}

function getTokens(userId, cb) {
    const query = "tokens"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any tokens"
            }
            return cb(err);
        };
        return cb(null, data.tokens);
    });
}

function getBasicInfo(userId, cb) {
    const query = "basicInfo"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any basicInfo"
            }
            return cb(err);
        };
        return cb(null, data.basicInfo);
    });
}

function getCalendarList(userId, cb) {
    const query = "calendarList"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have a calendarList"
            }
            return cb(err);
        };
        return cb(null, data.calendarList);
    });
}

function getCalendars(userId) {
    const query = "calendars"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any calendars"
            }
            return cb(err);
        };
        return cb(null, data.calendars);
    });
}

function getEvent(userId, calendarId, eventId, cb) {
    const query = "calendars.items"
    db.find({"userId": userId, [query] : {"$elemMatch" : {"id" : eventId}}}, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "The given event does not exist"
            }
            return cb(err);
        }
        //Dot notation might not work atm
        return cb(null, data.calendars.calendarId.items.id)
    });
}

function getRecipes(userId) {
    const query = "recipes"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any recipes"
            }
            return cb(err);
        }
        return cb(null, data.recipes)
    });
}


function getFinance(userId) {
    const query = "finance"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any finance data"
            }
            return cb(err);
        }
        return cb(null, data.finance)
    });
}

function getSettings(userId, cb) {
    const query = "settings"
    db.findOneSorted({"userId": userId, [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any settings"
            }
            return cb(err);
        }
        return cb(null, data.settings)
    });
}

function getCalendarSettings(userId, cb) {
    const query = "settings.calendars"
    db.findOneSorted({"userId": userId, [query + ".value"] : true}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any settings"
            }
            return cb(err);
        }
        return cb(null, data.settings.calendars.filter((x) => { return x.value }).map((x) => { return x.id }))
    });
}

//need to make the same as calendarSettings
function getCollegeSettings(userId, cb) {
    const query = "settings.course.modules"
    db.findOneSorted({"userId": userId, [query + ".value"] : true}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Given user does not have any settings"
            }
            return cb(err);
        }
        const course = data.settings.course
        const societies = data.settings.societies
        return cb(null, course.modules.filter((x) => { return x.value }).map((x) => { return x.module }), course.college, String(course.course)+String(course.year), societies)
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Update
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateOauth(userId, input) {
    const oAuthUpdate = {
        "oAuth": input.oAuth
    }
    db.update({"userId": userId}, {"$set": oAuthUpdate});
}

function updateCalendarListSyncToken(userId, input) {
    const calendarListSyncTokenUpdate = {
        "calendarList.nextSyncToken": input
    }
    db.update({"userId": userId}, {"$set": calendarListSyncTokenUpdate});
}

function updateCalendarList(userId, input) {
    const calendarListUpdate = {
        "calendarList": input
    }
    db.update({"userId": userId}, {"$set": calendarListUpdate});
}

function updateCalendarSyncToken(userId, input) {
    const calendarSyncTokenUpdate = {
        "calendarSyncToken" : input.calendarSyncToken
    }
    db.update({"userId": userId/*, calendarList.summary : input.summary*/}, {"$set": calendarSyncTokenUpdate});
}

function updateEventListSyncToken(userId, calendarId, input) {
    const eventListSyncTokenUpdate = {
        "calendars.$.nextSyncToken": input
    }
    db.update({ "userId": userId, "calendars.id": calendarId}, { "$push": eventListSyncTokenUpdate});
}

function updateAccessToken(userId, input) {
    const accessTokenUpdate = {
        "tokens.access_token": input
    }
    db.update({ "userId": userId}, { "$set": accessTokenUpdate});
}


function updateSettings(userId, settings) {
    const settingsUpdate = {
        "settings" : settings
    }
    console.log(settings.account)
    db.update({"userId" : userId}, {"$set" : settingsUpdate})
}

function updateCourse(userId, college, course, year, modules) {
    const courseUpdate = {
        "settings.course" : {
            "college" : college,
            "course" : course,
            "year" : year,
            "modules" : modules
        }
    }
    db.update({"userId" : userId}, {"$set" : courseUpdate})
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//POSSIBLE ASYNC ISSUES
//OKAY NEED TO SAVE CALENDARS AS OBJECTS WITH VALUES AND THIS FUNTION WILL WORK, Change Create User
function insertEvent(userId, calendarId, input) {
    db.findOne({"userId": userId, "calendars.id": calendarId, "calendars.$.items.id": input.id}, data => {
    if (data) {
        const removeUpdate = {
                "calendars.$.items": {"id": input.id}
            }
        db.update({"userId": userId, "calendars.id": calendarId}, { "$pull": removeUpdate});
        }
    const eventsUpdate = {
        "calendars.$.items": input
        }
    db.update({ "userId": userId, "calendars.id": calendarId}, { "$push": eventsUpdate});
    })
}

function insertNewCalendarListItem(userId, input) {
    const calendarListItemUpdate = {
        "calendarList.items": input
    }
    db.update({"userId": userId}, {"$push": calendarListItemUpdate});
}

function insertSetting(userId, input) {
    const settingUpdate = {
        "preferences" : input
    }
    db.update({ "userId": userId}, { "$set": settingUpdate})
}

function insertSocieties(userId, socs) {
    const societiesUpdate = {
        "settings.societies" : socs
    }
    db.update({"userId" : userId}, {"$pushAll" : societiesUpdate})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Remove
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeUser(userId){
    db.remove({"userId": userId})
}

function removeEvent(userId, calendarId, eventId) {
    const eventUpdate = {
        "calendars.$.items": {"id": eventId}
    }
    return db.update({ "userId": userId, "calendars.id": calendarId}, { "$pull": eventUpdate});
}

function removeSociety(userId, soc) {
    const societiesUpdate = {
        "settings.societies" : soc
    }
    db.update({"userId" : userId}, {"$pull" : societiesUpdate})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Inital user setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function insertCalendarList(userId, input) {
    const calendarListUpdate = {
        "calendarList.calendars": input
    }
    db.update({"userId" : userId}, {"$set" : calendarListUpdate});

    var calendarListSettings = {}
    for (var i = 0; i < input.items.length;i++) {
        var summary = input.items[i].summary
        var id = input.items[i].id
        var calendarListSettingsUpdate = {
            ["settings.calendars"] : {"summary" : summary, "id" : id, "value" : true}
        }
        db.update({"userId": userId}, {"$addToSet": calendarListSettingsUpdate});
    }
}
function insertEventList(userId, input) {
    const eventListUpdate = {
        "calendars": input
    }
    db.update({"userId": userId}, {"$push": eventListUpdate});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////