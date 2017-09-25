const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const dataDbMethods = require('../dataMethods');
const usefulMethods = require('../usefulMethods');
const userDbMethods = require('../userMethods');
const colleges = ["DCU", "UCD", "TCD"];
const uuid = require('uuid');

function initialAuth(req, res, next) {
    console.log("intial")
    const email = req.headers.email || null
    const password = req.headers.password || null
    const college = String((req.headers.college).toUpperCase()) || null
    console.log(email,password,college)
    dataDbMethods.checkSocLogin(email, password, college, (err, name) => {
        if (err) {
            return res.status(err.error).send(err.payload);
        }
        console.log(name)
        return res.status(200).send(name)
    });
}


function auth(req, res, next) {
    console.log("auth")
    const email = req.headers.email || null
    const password = req.headers.password || null
    const college = String((req.headers.college).toUpperCase()) || null
    dataDbMethods.checkSocLogin(email, password, college, (err, name) => {
        if (err) {
            return res.status(err.error).send(err.payload);
        }
        return next()
    });
}
// {"name": "Sub Aqua", "event" : {"summary":"TEST TITLE", "description": "TEST DESCRIPTION", "location": "TEST LOCATION", "timeMin":"12:00", "timeMax":"13:00", "date":"24-03-2017"} }

function insertSocEvent(req, res) {
    const event = req.body.event
    var id = uuid.v4()
    event.id = id
    event.colour = "#a569bd"
    console.log(event.name)
    const name = req.body.name
    const college = req.headers.college
    dataDbMethods.insertSocEvent(college, name, event);
    res.status(200).send("Event successfully added");
}


function removeSocEvent(req, res) {
    const id = req.body.id
    const name = req.body.name
    const college = req.headers.college
    dataDbMethods.removeSocEvent(college, name, id);
    res.status(200).send("Event successfully removed");
}

function updateSocEvent(req, res) {
    const event = req.body.event
    const name = req.body.name
    const college = req.headers.college
    dataDbMethods.updateSocEvent(college, name, event);
    res.status(200).send("Event successfully updated");
}
// {"name": "Sub Aqua", "event" : {"id": "0f3f0172-19b1-48cb-80ad-438823c81cca","summary":"THIS SHOULD BE THIS NOW PART 2", "description": "Editted", "location": "dhsgadasda", "timeMin":"12zsdsad:00", "timeMax":"13:dsadsadas00", "date":"24-!!!!03-2017"} }

function getSocEvents(req, res) {
    const college = req.params.college
    const name = req.params.name
    console.log(name);
    dataDbMethods.getSocEvents(college, name, (err, socEvents) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        res.status(200).send(socEvents);
    })
}


function getSocs(req, res) {
    const userId = req.params.userId
    userDbMethods.getSettings(userId, (err, settings) => {
        const college = settings.course.college;
        dataDbMethods.getSocList(college, (err, socsList) => {
            if (colleges.indexOf(college) != -1) {
                    if (err) {
                        return res.status(err.error).send(err);
                    }
                    return res.status(200).send({"societies" : socsList});
            } else {
                res.status(503).send("That college isn't in our database.")
            }
        })
    })
}

function getUsersSocsEvents(socs, cb) {
    const userId = req.params.userId
    userDbMethods.getSettings(userId, (err, settings) => {
        const college = settings.course.college;
        dataDbMethods.getSocList(college, (err, socsList) => {
            if (colleges.indexOf(college) != -1) {
                    if (err) {
                        return res.status(err.error).send(err);
                    }
                    res.status(200).send(socsList);
            } else {
                res.status(503).send("That college isn't in our database.")
            }
        })
    })
}


module.exports = {
    initialAuth,
    auth,
    insertSocEvent,
    removeSocEvent,
    updateSocEvent,
    getSocEvents,
    getSocs,
    getUsersSocsEvents,
}
