
const usefulMethods = require('../usefulMethods');
const userDbMethods = require('../userMethods');
const gCal = require('googleapis').calendar('v3');
const gAuth = require('../DO_NOT_ADD_TO_REPO/googleAuthKeys');
const dataDbMethods = require('../dataMethods');
const async = require('async');
const fs = require('fs');

module.exports = {
    auth,
    getTodaysEvents,
    insertEvent,
    patchEvent,
    removeEvent,
    sync,
    checkUser
};


// AUTHENTICATES AND LOGS IN A USER //
function auth(req, res) {
// app.post('/auth', function(req, res) {
    var serverID = gAuth.client;
    var id = req.body['idToken'];
    var aud = req.body['aud'];
    var authCode = req.body['authCode'];
    var platform = req.body['platform'];
    var myOAuth2Client = gAuth.getOAuth2Client(platform);
    // CHECK ANDROID "AUD" AGAINST SERVER COPY, TO VERIFY PAYLOAD IS FROM LEGIT App
    if (aud.indexOf(serverID) === -1) {
        return res.status(418).send("We're terribly sorry, but it appears you're a teapot")
    }
    // OBTAIN PAYLOAD OF USERS PROFILE DETAILS
    myOAuth2Client.verifyIdToken(id, aud, function(err, login) {
        if (err) {
            console.error(err)
            res.status(400).send("Issue verifying user/application information with Google")
        }
        // ONCE VERIFIED, TAKE THE AUTHCODE FROM APP, HANDSHAKE WITH GOOGLE SERVERS TO OBTAIN ACCESS CODE
        myOAuth2Client.getToken(authCode, function(err, tokens) {
            if (err) {
                // res.status(400).send(err);
                console.log(err)
                res.status(400).send("Issue generating user credentials with Google")
            }
            // ACCESS TOKEN SAVED TO myAUTH2CLIENT OBJECT
            // N.B REFRESH TOKEN ONLY GIVEN WITH FIRST INITAL AUTHORISATION
            // EXTREMELY IMPORTANT ITS STORED
            myOAuth2Client.setCredentials(tokens);
            var userId = login.getPayload().sub;
            userDbMethods.checkUser(userId, err => {
                if (err) {
                    console.log("creating user")
                    userDbMethods.createUser(tokens, login.getPayload())
                    gCal.calendarList.list({
                        auth: myOAuth2Client,
                        fields: ['nextSyncToken,items(id,summary)']
                        }, function (err, res) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        var nextSyncToken = res.nextSyncToken;
                        var calendarIdList = res.items;
                        userDbMethods.insertCalendarList(userId, res);
                        calendarIdList.forEach(function(item) {
                            gCal.events.list({
                                auth: myOAuth2Client,
                                calendarId: item.id,
                                maxResults: '2500',
                                fields: ['nextSyncToken,summary,items(id,summary,start,end)']
                                }, function (err, res) {
                                    if (err) {
                                        if (err.code == 404) {
                                            console.error("Can't pull default Google Calendars")
                                        }
                                        else {
                                            console.error(err)
                                        }
                                    }
                                    if (res !== "Not Found" & res != undefined) {
                                        res.id = item.id
                                        userDbMethods.insertEventList(userId,res)
                                    }
                                }
                            );
                        });
                    });
                }
            })
            res.status(200).send({userId: login.getPayload().sub})
        });
    });
}


// // GETS TODAYS EVENTS FROM ALL OF A USERS CALENDAR EVENTS IN GOOGLE + GIVES BACK TIMETABLE FOR THE DAY //
// function getTodaysEvents(req, cb) {
// // app.get('/tasks/day/:userId/:date/:calendars', function(req, res) {
//     //app.get('/tasks/day/:userId/:date', function(req, res) {
//     try {
//         var userId = req.params['userId'];
//         var date = req.params['date'];
//         var calendars = (req.params['calendars']).split(",");
//         var year = date.slice(0,4);
//         var month = date.slice(4,6);
//         var day = date.slice(6,8);
//         var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
//         var timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T23:59:59Z";
//         var timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T00:00:00Z";
//         var dayValue = (new Date(date.slice(0,4),(Number(date.slice(4,6))-1).toString(),date.slice(6,8))).getDay()
//         usefulMethods.checkAccessToken(userId);
//         userDbMethods.getTokens(userId, (err, tokens) => {
//             if (err) {
//                 console.log(err)
//                 return cb(err.error, err)
//             }
//             var myOAuth2Client = gAuth.getOAuth2Client();
//             myOAuth2Client.setCredentials(tokens);

//             userDbMethods.getSettings(userId, (err, settings) => {
//                 if (err) {
//                     console.log(err)
//                     return cb({status:404, err})
//                 }
//                 const calendarList = settings.calendars
//                 var eventsToday = {
//                     "eventData" : [],
//                 };
//                 dataDbMethods.getCourseDay("DCU", "CPSSD2", days[dayValue], (err, courseDay) => {
//                     if (err) {
//                         console.log(err)
//                         return cb({status:404, err})
//                     }
//             		if (dayValue != 6 && dayValue != 0) {
//                     	eventsToday["college"] = courseDay
// 	                    // CODE TO CHANGE THE TIMES TO RFC FORMAT, SAME AS WITH GOOGLE. IMPORTANT TO STANDARDISE THE OBJECT RESPONSES //
// 	                    for (var i = 0; i < eventsToday.college.length ;i++) {
// 	                    	// t + "floppy" -> `${t}floppy` //
// 	                    	// TAKES THE CURRENT TIMES, AND CHANGES THEM TO THE RFC FORMAT //
// 	                        eventsToday.college[i].timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T" + eventsToday.college[i].start.slice(0,2) + ":" + eventsToday.college[i].start.slice(3,5) + ":00Z"
// 	                        eventsToday.college[i].timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T" + eventsToday.college[i].end.slice(0,2) + ":" + eventsToday.college[i].end.slice(3,5) + ":00Z"
// 	                        delete eventsToday.college[i].start
// 	                        delete eventsToday.college[i].end
// 	                    }
// 	                }
//                     if (calendars != undefined & calendars != []){
//                         async.each(calendarList, (calendar, next) => {
//                             if (calendars.indexOf(calendar.summary) >= 0) {
//                                 gCal.events.list({
//                                     auth: myOAuth2Client,
//                                     calendarId : calendar.id,
//                                     timeMax,
//                                     timeMin,
//                                     fields: ['summary,items(id,summary,description,location,start,end)']
//                                 }, function (err, response) {
//                                     if (err) {
//                                         console.error("Can't pull default Google Calendars");
//                                         next("Can't pull default Google Calendars");
//                                     }
//                                     else {
//                                         if (response != "Not Found" & response!= undefined) {
//                                             if (response.items && response.items.length != 0) {
//                                                 //response.id : calendarList[i].id
//                                                 response.items.forEach(function(item) {
//                                                     if (item.start.dateTime) {
//                                                         item.start = item.start.dateTime;
//                                                         item.end = item.end.dateTime;
//                                                     }
//                                                     else if (item.start.date) {
//                                                         //sets both the start and end values in the response object
//                                                         var times = usefulMethods.addFullDayTime(item.start.date);
//                                                         var dateStart = times[0];
//                                                         var dateEnd = times[1];
//                                                         item.start = dateStart;
//                                                         item.end = dateEnd;

//                                                     }
//                                                 });
//                                                 eventsToday.eventData.push(response);
//                                             }
//                                         }
//                                         next();
//                                     }
//                                 });
//                             } else {
//                                 next();
//                             }
//                         }, err => {
//                             // if (err) return res.status(500).send(err);
//                             if (err) return cb({status:500, payload:err})
//                             console.log("Returned Event data -> ");
//                             // res.status(200).send(eventsToday);
//                             return cb({status:200, payload:eventsToday})
//                         });
//                     }
//                 });
//             });
//         });
//     }
//     catch(err) {
//         console.error("Would have crashed the server except for this catch - " + err);
//     }
// }



// GETS TODAYS EVENTS FROM ALL OF A USERS CALENDAR EVENTS IN GOOGLE + GIVES BACK TIMETABLE FOR THE DAY //
function getTodaysEvents(req, res) {
// app.get('/tasks/day/:userId/:date/:calendars', function(req, res) {
    //app.get('/tasks/day/:userId/:date', function(req, res) {
    try {
        var userId = req.params['userId'];
        var date = req.params['date'];
        var year = date.slice(0,4);
        var month = date.slice(4,6);
        var day = date.slice(6,8);
        var days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
        var timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T23:59:59Z";
        var timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T00:00:00Z";
        var dayValue = (new Date(date.slice(0,4),String((Number(date.slice(4,6))-1)),date.slice(6,8))).getDay()
        usefulMethods.checkAccessToken(userId);
        userDbMethods.getTokens(userId, (err, tokens) => {
            if (err) {
                console.log(err)
                return res.status(err.error).send(err);
            }
            var myOAuth2Client = gAuth.getOAuth2Client();
            myOAuth2Client.setCredentials(tokens);
            userDbMethods.getCalendarSettings(userId, (err, calendarList) => {
                console.log("CalendarList for todays events -> : " + calendarList)
                if (err) {
                    console.log(err)
                    return res.status(err.er).send(err)
                }
                var eventsToday = {
                    "eventData" : [],
                };
                async.each(calendarList, (calendar, next) => {
                    gCal.events.list({
                        auth: myOAuth2Client,
                        calendarId : calendar,
                        timeMax,
                        timeMin,
                        fields: ['summary,items(id,summary,description,location,start,end)']
                    }, function (err, response) {
                        if (err) {
                            console.error("Can't pull default Google Calendars");
                            return next();
                        }
                        if (response != "Not Found" & response!= undefined) {
                            if (response.items && response.items.length != 0) {
                                //response.id : calendarList[i].id
                                response.items.forEach(function(item) {
                                    if (item.start.dateTime) {
                                        item.timeMin = item.start.dateTime;
                                        item.timeMax = item.end.dateTime;
                                    }
                                    else if (item.start.date) {
                                        //sets both the start and end values in the response object
                                        var times = usefulMethods.addFullDayTime(item.start.date);
                                        var dateStart = times[0];
                                        var dateEnd = times[1];
                                        item.timeMin = dateStart;
                                        item.timeMax = dateEnd;
                                    }
                                    item["calendarSummary"] = response.summary
                                });
                                for (var i = 0; i < response.items.length; i++) {
                                    eventsToday.eventData.push(response.items[i])
                                }
                            }
                        }
                        return next();
                    });
                }, err => {
                    if (err) return res.status(500).send(err)
                    console.log("Returned Event data -> " + JSON.stringify(eventsToday));
                    return res.status(200).send(eventsToday)
                });
            });
        });
    }
    catch(err) {
        console.error("Would have crashed the server except for this catch - " + err);
    }
}


function insertEvent(req, res) {
    var userId = req.body['userId'];
    var calendarId = req.body['calendarId'];
    var summary = req.body['summary'];
    var location = req.body['location'] || "Dublin/Ireland";
    var description = req.body['description'];
    var timeStart = req.body['timeMin'];
    var timeEnd = req.body['timeMax'];
    // var timeZone = req.body['timeZone'];
    var item = {
        summary,
        location,
        description,
        'start': {
            'dateTime': timeStart,
            // timeZone,
        },
        'end': {
            'dateTime': timeEnd,
            // timeZone,
        },
        'reminders': {
            'useDefault': true
        },
    };
    usefulMethods.checkAccessToken(userId)
    userDbMethods.getUser(userId, (err, user) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        var myOAuth2Client = gAuth.getOAuth2Client();
        var tokens = user.tokens;
        myOAuth2Client.setCredentials(tokens);

        gCal.events.insert({
            auth: myOAuth2Client,
            calendarId: calendarId,
            resource: item,
        }, function(err, event) {
            if (err) {
                console.error('There was an error contacting the Calendar service: ' + err);
                return res.status(403).send("There was a problem adding your event")
            }
            else {
            var gItem = {
                "id": event.id,
                "summary": event.summary,
                "start": event.start,
                "end": event.end,
            };
            userDbMethods.insertEvent(userId, calendarId, gItem);
            return res.status(200).send("Event inserted");
            }
        });
    });
}


//
function patchEvent(req, res) {
    var userId = req.body['userId'];
    var calendarId = req.body['calendarId'];
    var eventId = req.body['eventId'];
    var resource = req.body['body'];

    usefulMethods.checkAccessToken(userId)
    userDbMethods.getUser(userId, (err, user) => {
        if (err) {
            return res.status(err.er).send(err)
        }
        var myOAuth2Client = gAuth.getOAuth2Client();
        var tokens = user.tokens;
        myOAuth2Client.setCredentials(tokens);
        var gBody = {
            auth: myOAuth2Client,
            calendarId,
            eventId,
            resource
        }
        console.log(gBody);
        gCal.events.patch(gBody, function (err, event) {
            if (err) {
                console.error('There was an error contacting the Calendar service: ' + err);
                return res.status(403).send("There was a problem modifying your event")
            }
            else {
                var gItem = {
                    "id": event.id,
                    "summary": event.summary,
                    "start": event.start,
                    "end": event.end,
                };
                userDbMethods.insertEvent(userId, calendarId, gItem);
                return res.status(200).send("Message patched");
            }
        });
    })
}

function removeEvent(req, res) {
// app.post('/tasks/remove', function(req, res) {
    var userId = req.body['userId'];
    var calendarId = req.body['calendarId'];
    var eventId = req.body['eventId'];

    userDbMethods.getUser(userId, (err, user) => {
        if (err) {
            return res.status(err.er).send(err)
        }
        var tokens = user.tokens;
        var myOAuth2Client = gAuth.getOAuth2Client();
        myOAuth2Client.setCredentials(tokens);
        myOAuth2Client.refreshAccessToken(function(err, tokens) {
        });

        gCal.events.delete({
            auth: myOAuth2Client,
            calendarId,
            eventId
            }, function (err, response) {
                if (err) {
                    console.error(err);
                    return res.status(403).send("There was a problem removing your event");
                }
                else {
                    userDbMethods.removeEvent(userId, calendarId, eventId);
                    return res.status(200).send("Event removed");
                }
            }
        );
    });
}


function sync(req, res) {
    var userId = req.params.userId;
    userDbMethods.getUser(userId, (err, user) => {

        var tokens = user.tokens;
        var myOAuth2Client = gAuth.getOAuth2Client();
        myOAuth2Client.setCredentials(tokens);
        myOAuth2Client.refreshAccessToken(function(err, tokens) {
        });
        // CHECK FOR NEW CALENDARS MADE BY USER ON GOOGLE
        gCal.calendarList.list({
            auth: myOAuth2Client,
            syncToken: user.calendarList.nextSyncToken,
            fields: ['nextSyncToken,items(id,summary)']
            }, 
            function(err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
                else if (res.items !== []) {
                    userDbMethods.updateCalendarListSyncToken(userId,res.nextSyncToken);
                    res.items.forEach(function(item) {
                        userDbMethods.insertNewCalendarListItem(userId,item);
                    });
                }
                // FOR EACH CALENDAR, CHECK FOR ANY NEW EVENTS
                user.calendarList.items.forEach(function(calendar){
                    console.log(calendar.id);
                    gCal.events.list({
                        auth: myOAuth2Client,
                        calendarId: calendar.id,
                        syncToken: user.calendarList.nextSyncToken,
                        fields: ['nextSyncToken,summary,items(id,summary,start,end)']
                        }, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                userDbMethods.updateEventListSyncToken(userId,calendar.id,res.nextSyncToken);
                                res.items.forEach(function(event) {
                                    // IF EVENT IS ALREADY IN DATABASE, DELETE AND ADD NEW (DONE BY insertEvent) 
                                    userDbMethods.insertEvent(userId,calendar.id,event);
                                })
                            }
                        }
                    );
                });
            }
        )
    });
}


function checkUser(req, res) {
    const userId = req.params.userId
    userDbMethods.checkUser(userId, err => {
        if (err) {
            return res.status(200).send(err);
        }
        return res.status(200).end();
    });
}
