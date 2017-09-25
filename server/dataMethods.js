const database = require('./mongoDB');
const db = new database.create('data');

module.exports = {
    checkSocLogin,
    getBusStops,
    getSocList,
    getSocEvents,
    getSocEventsToday,
    getCourseDay,
    getModules,
    updateBusStops,
    updateSocEvent,
    insertSoc,
    insertSubscriber,
    insertSocEvent,
    insertCourse,
    removeSubscriber,
    removeSocEvent
}

//CHECK
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkSocLogin(email, password, college, cb) {
    const query = "societies." + college + ".credentials"
    db.find({"id" : "server", [query] : { "$exists" : true }, [query] : { "$elemMatch" : { "email" : email, "password" : password }}}, data => {
        if (!data || data.length == 0) {
            const err = {
                "error" : 401,
                "payload" : "This email and password combination is incorrect"
            }
            return cb(err);
        };
        return cb(null, (data[0].societies[college].credentials.filter((x) => {return x.email == email}).map((x) => {return x.soc}))[0]);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Get
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBusStops(cb) {
    const query = "dublinBus.stops"
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "There is no bus info"
            }
            return cb(err);
        };
        return cb(null, data.dublinBus.stops);
    });
}

function getSocList(college, cb) {
    const query = "societies." + college + ".list"
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Could not find a soc list for that college"
            }
            return cb(err);
        };
        return cb(null, (data.societies[college].list).sort());
    });
}

function getSocEvents(college, soc, cb) {
    const query = "societies." + college + ".info." + soc
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Could not find that society"
            }
            return cb(err);
        };
        return cb(null, data.societies[college].info[soc].events);
    });
}

function getSocEventsToday(college, soc, date, cb) {
    const query = "societies." + college + ".info." + soc
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Could not find that society"
            }
            return cb(err);
        };
        return cb(null, data.societies[college].info[soc].events.filter((x) => { return x.date == date}));
    });
}

function getCourseDay(college, course, day, cb) {
    const query = "timetables." + college + "." + course + "." + day
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Could not find any data for that day"
            }
            return cb(null, []);
        };
        return cb(null, data.timetables[college][course][day]);
    });
}

function getModules(college, course, cb) {
    const query = "timetables." + college + "." + course + ".modules"
    db.findOneSorted({ "id" : "server", [query] : { "$exists" : true }}, { [query] : 1 }, data => {
        if (!data) {
            const err = {
                "error" : 418,
                "payload" : "Could not find any modules for that course"
            }
            return cb(err);
        };
        return cb(null, data.timetables[college][course].modules);
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Update
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateBusStops(input) {
    const busStopsUpdate = {
        "dublinBus.stops" : input
    }
    db.update({"id": "server"}, {"$set" : busStopsUpdate});
}

function updateSocEvent(college, soc, event) {
    const query = "societies." + college + ".info." + soc + ".events."
    const eventUpdate = {
        [query + "$"] : event,
    }
    db.update({"id" : "server", [query + "id"] : event.id}, {"$set" : eventUpdate})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Insert
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertSoc(college, soc, email, password) {
    const credentialsUpdate = {
        ["societies." + college + ".credentials"]  : { "email" : email, "password" : password, "soc" : soc}
    }
    db.update({ "id": "server"}, { "$addToSet" : credentialsUpdate});

    const listUpdate = {
        ["societies." + college + ".list"]  : soc
    }
    db.update({ "id": "server"}, { "$push" : listUpdate});

    const eventsUpdate = {
        ["societies." + college + ".info." + soc] : {"events" : [], "subscribers" : []}
    }
    db.update({"id" : "server"}, {"$set" : eventsUpdate});
}

function insertSubscriber(college, soc, subscriber) {
    const subscriberUpdate = {
        ["societies." + college + ".info." + soc + ".subscribers"] : subscriber
    }
    db.update({"id" : "server"}, {"$push" : subscriber});
}

function insertSocEvent(college, soc, event) {
    const eventsUpdate = {
        ["societies." + college + ".info." + soc + ".events"] : event
    }
    db.update({ "id": "server"}, { "$push" : eventsUpdate});
}

function insertCourse(college, course, events) {
    const courseUpdate = {
        ["timetables." + college + "." + course] : events
    }
    db.update({ "id": "server"}, { "$set" : courseUpdate});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Remove
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeSubscriber(college, soc, subscriber) {
    const subscriberUpdate = {
        ["societies." + college + ".info." + soc + ".subscribers"] : subscriber
    }
    db.update({"id" : "server"}, {"$pull" : subscriberUpdate})
}

function removeSocEvent(college, soc, id) {
    const eventsUpdate = {
        ["societies." + college + ".info." + soc + ".events"] : {"id" : id}
    }
    db.update({"id" : "server"}, {"$pull" : eventsUpdate})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////