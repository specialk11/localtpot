const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const dataDbMethods = require('../dataMethods');
const usefulMethods = require('../usefulMethods');
const userDbMethods = require('../userMethods');



function getDCUCourse(course, todaysDate) {
    request("http://www.dcu.ie/gCal/default.aspx?PoSiCalOra&p1=" + course, function(err, html) {
        if (err) {
            console.error("Issue getting timetable from ical: " + err)
        }
        else {
            var body = html.body;
            var bodyArray = body.split('\n');
            if (!bodyArray[100]) {
                console.error("Not a correct coursecode, or ical didn't give a timetable - " + course);
                fs.appendFile('./college/failed.txt', course + "\n", function (err) {})
                // cb({status:400, payload: "Can't seem to find that coursecode in the database"});
            }
            else {
                var modules = []
                var json = {
                    'monday' : [],
                    'tuesday' : [],
                    'wednesday' : [],
                    'thursday' : [],
                    'friday' : [],
                    'modules' : []
                }
                var alreadyInserted = []
                for (var dayValue = 0; dayValue < 5; dayValue++) {
                    // This line breaks the date off to just year/month, and adds on to it the day in increasing values based on the above loop (i.e 20170319, 20170320, 201703)
                    var currentDay = (todaysDate.substring(0, todaysDate.length-2) + (Number(todaysDate.substring(todaysDate.length,todaysDate.length-2)) + dayValue).toString())
                    for (var i = 0, len = bodyArray.length; i < len; i++) {
                        if (bodyArray[i].slice(0,7) === "DTSTART" && bodyArray[i].slice(27,35) === currentDay) {
                            var summary = bodyArray[i+9].replace(/\s/g,'');
                            // A check to see if its the lab or not
                            if (summary.slice(summary.length-6,summary.length - 1).indexOf("P") != -1) {
                                summary = summary.slice(8, summary.length - 1) + " - Practical";
                                var colour = "#cceeff";
                            }
                            else if (summary.slice(summary.length-6,summary.length - 1).indexOf("T") != -1) {
                                summary = summary.slice(8, summary.length - 1) + " - Tutorial";
                                var colour = "#ffeecc";
                            }
                            else if (summary.slice(summary.length-6,summary.length - 1).indexOf("S") != -1) {
                                summary = summary.slice(8, summary.length - 1) + " - Seminar";
                                var colour = "#eeffcc";
                            }
                            else {
                                summary = summary.slice(8, summary.length - 1) + " - Lecture";
                                var colour = "#ffcccc";
                            }
                            // summary = summary.slice(0,summary.indexOf("["));
                            // var date = bodyArray[i+1].slice(-16,-8);
                            var description = bodyArray[i+10].slice(12,-1).replace('&amp;', '&');

                            var location = bodyArray[i+11].slice(9,bodyArray[i+11].length-2)

                            var start = bodyArray[i].slice(-7,-3);
                            start = start.slice(0, 2) + "." + start.slice(2, start.length);

                            var end = bodyArray[i+1].slice(-7,-3);
                            end = end.slice(0, 2) + "." + end.slice(2, end.length);
                            var module = {
                                //"date": date,
                                summary,
                                description,
                                start,
                                end,
                                location,
                                colour
                            }
                            var toBeInserted = {"module" : module.description, "value" : true}
                            json[Object.keys(json)[dayValue]].push(module);
                            if (alreadyInserted.indexOf(module.description) == -1) {
                                json.modules.push(toBeInserted)
                                alreadyInserted.push(module.description)
                            }
                        }
                    }
                }
                console.log(course);
                dataDbMethods.insertCourse("DCU", course, json);
                fs.appendFile('./college/successful.txt', course + "\n", function (err) {})
                // cb({status:200,payload:json});
            }
        }
    })
}

function getDCUSocs(cb) {
// app.get('/grabSoc/', function(req, res) {
    url = 'http://www.dcusu.ie/clubs'
    var payload = [];
    request(url, function(err, html) {
        if (!err) {
            var $ = cheerio.load(html.body, {
                        ignoreWhitespace: true,
                        xmlMode: false
                    });
            $('p', '.clubSocSection').each(function(i, elem) {
				var name = ($(this).text()).split(" ")
				var email = name.pop()
				name = name.join(" ");
				usefulMethods.generatePassword(password => {
					dataDbMethods.insertSoc("DCU", name, email, password)
				})
				payload.push({name,email});
                // fs.appendFile('./college/socs.txt', JSON.stringify({name,email}) + "\n", function (err) {})
            });
            
            cb({status:200, payload})
        }
    })
}

// function getCourseDay(req, res) {
//     const date = req.params.date;
//     const college = req.params.college
//     const year = date.slice(0,4);
//     const month = date.slice(4,6);
//     const day = date.slice(6,8);
//     const course = req.params.course + req.params.year
//     const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
//     const dayValue = (new Date(date.slice(0,4),(Number(date.slice(4,6))-1).toString(),date.slice(6,8))).getDay()
//     var eventsToday = {}
//     try {
//         dataDbMethods.getCourseDay(college, course, days[dayValue], function(err, courseDay) {
//             console.log(courseDay)
//             if (dayValue != 6 && dayValue != 0 && courseDay) {
//                 eventsToday.college = courseDay
//                 // CODE TO CHANGE THE TIMES TO RFC FORMAT, SAME AS WITH GOOGLE. IMPORTANT TO STANDARDISE THE OBJECT RESPONSES //
//                 // if (eventsToday.college) {
//                     for (var i = 0; i < eventsToday.college.length ;i++) {
//                         // t + "floppy" -> `${t}floppy` //
//                         // TAKES THE CURRENT TIMES, AND CHANGES THEM TO THE RFC FORMAT //
//                         eventsToday.college[i].timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T" + eventsToday.college[i].start.slice(0,2) + ":" + eventsToday.college[i].start.slice(3,5) + ":00Z"
//                         eventsToday.college[i].timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T" + eventsToday.college[i].end.slice(0,2) + ":" + eventsToday.college[i].end.slice(3,5) + ":00Z"
//                         delete eventsToday.college[i].start
//                         delete eventsToday.college[i].end
//                     }
//                 // }
//             }
//         res.status(200).send(eventsToday)
//         });
//     } catch(err) {
//         console.error(err)
//         res.status(404).send("Can't seem to find that timetable at the moment!")
//     }
// }

function getCourseDay(req, res) {
    const userId = req.params.userId;
    const date = req.params.date;
    const college = req.params.college
    const year = date.slice(0,4);
    const month = date.slice(4,6);
    const day = date.slice(6,8);
    var final = []
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const dayValue = (new Date(date.slice(0,4),String((Number(date.slice(4,6))-1)),date.slice(6,8))).getDay()
    var eventsToday = []
    try {
        userDbMethods.getCollegeSettings(userId, (err, modules, college, course, societies) => {
            socEvents = []
            async.each(societies, (soc, next) => {
                dataDbMethods.getSocEventsToday(college, soc, date, (err, event) => {
                    if (err) {
                        return next(err)
                    }
                    socEvents = socEvents.concat(event)
                    return next()
                })
            }, err => {
                if (err) {
                    return res.status(err.error).send(err);
                }
                dataDbMethods.getCourseDay(college, course, days[dayValue], (err, courseDay) => {
                    if (err) {
                        return res.status(err.error).send(err);
                    }
                    if (courseDay) {
                        console.log("ENTERED")
                        courseDay = courseDay.concat(socEvents)
                        console.log(courseDay)
                    }
                        // CODE TO CHANGE THE TIMES TO RFC FORMAT, SAME AS WITH GOOGLE. IMPORTANT TO STANDARDISE THE OBJECT RESPONSES //
                        for (var i = 0; i < courseDay.length ;i++) {
                            // t + "floppy" -> `${t}floppy` //
                            if (modules.indexOf(courseDay[i].description) >= 0 || courseDay[i].colour == "#a569bd") {
                                courseDay[i].timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T" + courseDay[i].start.slice(0,2) + ":" + courseDay[i].start.slice(3,5) + ":00Z"
                                courseDay[i].timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T" + courseDay[i].end.slice(0,2) + ":" + courseDay[i].end.slice(3,5) + ":00Z"
                                delete courseDay[i].start
                                delete courseDay[i].end
                                final.push(courseDay[i])
                            }
                        }
                return res.status(200).send({college:final})
                })
            });
        });
    } catch(err) {
        console.error(err)
        return res.status(404).send("Can't seem to find that timetable at the moment!")
    }
}

// function getCourseDay(req, res) {
//     const userId = req.params.userId;
//     const date = req.params.date;
//     const college = req.params.college
//     const year = date.slice(0,4);
//     const month = date.slice(4,6);
//     const day = date.slice(6,8);
//     const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
//     const dayValue = (new Date(date.slice(0,4),String((Number(date.slice(4,6))-1)),date.slice(6,8))).getDay()
//     var eventsToday = {}
//     try {
//         userDbMethods.getModulesSettings(userId, (err, modules, college, course) => {
//             dataDbMethods.getCourseDay(college, course, days[dayValue], function(err, courseDay) {
//                 if (err) {
//                     return res.status(err.error).send(err);
//                 }
//                 if (dayValue != 6 && dayValue != 0 && courseDay) {
//                     // CODE TO CHANGE THE TIMES TO RFC FORMAT, SAME AS WITH GOOGLE. IMPORTANT TO STANDARDISE THE OBJECT RESPONSES //
//                     for (var i = 0; i < courseDay.length ;i++) {
//                         // t + "floppy" -> `${t}floppy` //
//                         if (modules.indexOf(courseDay[i].description) != -1) {
//                             courseDay[i].timeMin = String(year) + "-" + String(month) + "-" + String(day) + "T" + courseDay[i].start.slice(0,2) + ":" + courseDay[i].start.slice(3,5) + ":00Z"
//                             courseDay[i].timeMax = String(year) + "-" + String(month) + "-" + String(day) + "T" + courseDay[i].end.slice(0,2) + ":" + courseDay[i].end.slice(3,5) + ":00Z"
//                             delete courseDay[i].start
//                             delete courseDay[i].end
//                         } else {
//                             courseDay.splice(i, 1);
//                         }
//                     }
//                 }
//             return res.status(200).send({college:courseDay})
//             })
//         });
//     } catch(err) {
//         console.error(err)
//         return res.status(404).send("Can't seem to find that timetable at the moment!")
//     }
// }

module.exports = {
    getDCUCourse,
    getDCUSocs,
    getCourseDay,
}
