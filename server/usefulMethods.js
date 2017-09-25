var request = require('request');
var userDbMethods = require('./userMethods');
var gAuth = require('./DO_NOT_ADD_TO_REPO/googleAuthKeys');
var cheerio = require('cheerio');
const googleMethods = require('./tasks/googleMethods');

module.exports = {

    checkModuleCodes : function(modulecode) {
        var courseCodes = "3UMHCT1,3UMHLM2,AC1,AC2,AC3,AC4,ACM1,ACM2,ACM3,ACM4,AF1,AF2,AF3,ALISI4,ALIST4,ALTS1,ALTS2,AMPS1,AMPS2,AMPS3,AMPS4,AP1,AP2,AP3,AP4,AS1,AS2,AS3,AS4,ATT1,ATT2,ATT3,ATT4,BAISRS3,BAJH1,BAJI1,BAJL1,BAJM1,BAJP1,BATLEC,BCL1,BCL2,BCL3,BCLYA4,BED1,BET2,BET3,BHS1,BHS2,BHS3,BMED1,BMED2,BMED3,BMED4,BMEDV5,BNCG1,BNCG2,BNCG3,BNCG4,BNGN1,BNGN2,BNGN3,BNGN4,BNID1,BNID2,BNID3,BNID4,BNPY1,BNPY2,BNPY3,BNPY4,BPY1,BPY2,BPY3,BPY4,BRE1,BREDE3,BREDH3,BREDM3,BRH1,BRM1,BS1,BS2,BS3,BSI4,BT1,BT2,BT3,BT4,CA1,CAFM1,CAM1,CAM2,CAM3,CAM4,CAMMC,CAMQC,CASE2,CASE3,CASE4,CCS1,CCS2,CCS3,CCSYA4,CCT1,CE1,CES1,CPSSD1,CPSSD2,CS1,CS2,CS3,DPSY1,DPSY3,EBC1,EBF1,EBF2,EBF3,EBF4,EBG1,EBG2,EBG3,EBG4,EBS1,EBS2,EBS4,EBT1,EBT2,EBT3,EBT4,EC1,EC2,EC3,EC4,ECE1,ECE2,ECE3,EMM2,ENGLIC2,ENGLIC3,EPL1,EPL2,EPL3,EPLYA4,ESH1,ESH2,ESH3,ESH4,ESPD1,ESPD2,ESPD6,ESPD7,ESPD8,ESPM4,ESPT1,ET1,ET2,ET3,ETF3,ETF4,FIM3,FIM4,FM2,FM3,FM4,FRGF4,GAP1,GCB1,GCB2,GCB3,GCB4,GCCSCS1,GCDEV1,GCDF2,GCDFC,GCESC,GCETHH1,GCISE1,GDF1,GDMHPC,GDPCC,GDREPW1,GG1,GG2,GG3,GG4,GI1,GI2,GI3,GMO1,HOR4,IBLFGS4,IBLFS2,IBLFS4,IBLGS1,IBLGS3,IBLJ3,IFCAF1,IFCBLJ1,IFCBS1,IFCCA1,IFCCES1,IFCEPL1,IFCIR1,IFCLCE1,IFCLIS1,IFCMME1,IFPBM1,IFPBMD1,IFPCL1,IFPES1,IFPFIM1,IFPMBE1,IFPMCM1,IFPMIR1,IFPSBM1,IFPSCM1,IFPSES1,IFPSIC1,IFPSIR1,IFPTE1,IMLGS4,IMLJ3,INTB1,INTB2,INTB3,INTB4,IR1,IR2,IR3,IRYA4,JHIIL3,JHLFR2,JHLIR3,JHLMS3,JHMSI3,JHPIL3,JR1,JR2,JR3,LOA3,LOA4,MACL1,MACSPW1,MAEDRC,MAENR1,MAENR3,MAETCR1,MAETCR2,MAETH1,MAETH2,MAETHC,MAGB1,MAJ1,MAP1,MAPS1,MAPS2,MARCETC,MARCPH1,MARCPHC,MARCTP1,MARCTP2,MAREDL1,MAREML1,MAREML2,MAREMLC,MAREPP1,MAREPPC,MAREPW1,MAREPWC,MARERE1,MASS1,MATH1,MATH2,MBA1,MBD1,MBS1,MCM1,MCMC,MCOU1,MCOU2,MCOU3,MCOU4,MCPA1,MCPAC,MCTC,MDEV1,MDEV2,MDF1,ME2,ME3,ME4,MECB1,MECT1,MEME1,MEME2,MEML1,MEML2,MENC,MFCM1,MFM1,MGC2,MGNPC,MHRM1,MIA2,MIC2,MIN1,MINT1,MINT2,MINT4,MINTD2,MIR1,MIR2,MISC1,MISMC,MITB1,MITB2,MMA1,MMA2,MMA3,MMA4,MMACC,MMHNP1,MMHNPC,MMHPC,MMM1,MMO1,MMP2,MOCLD2,MOPSC,MOPSDC,MP2,MP4,MPAL6,MPO2,MPVC,MREPC,MSAL1,MSBE1,MSBEC,MSBM1,MSC1,MSC2,MSDC,MSDM2,MSE1,MSED1,MSEF1,MSEF2,MSGC1,MSGC2,MSMS1,MSOB2,MTS1,MTT1,MTV1,MTV2,MWB2,MWB3,MWB4,NSPM5,NSPT1,PBM1,PBM2,PBM3,PBM4,PDPB1,PDPE2,PDTHT2,PDTHT3,PEB1,PEB3,PEB4,PEM2,PEM3,PHA1,PHA2,PHA3,PHA4,PME1,PME2,RMSAX,SAMPBC,SAMPSC,SE1,SE2,SE3,SE4,SMDCADC,SMPB1,SPDA3,SPDE3,SPDE4,SPDW2,SSH1,SSH2,SSH3,SSH4,TC2,TCD1"

        if ((courseCodes.indexOf(modulecode)) > -1) {
            return true
        };
        return false
    },

    // processCredentials : function(userId) {
    //  userDbMethods.getUser(userId, user => {
    //         var tokens = user.tokens;
    //         var myOAuth2Client = gAuth.getOAuth2Client();
    //         myOAuth2Client.setCredentials(tokens);
    //         myOAuth2Client.refreshAccessToken(function(err, tokens) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         });
    //         console.log("HSJGADJHJHSA");
    //      return myOAuth2Client
    //     });
    // },

    addFullDayTime : function(date) {
        var year = date.slice(0,4);
        var month = date.slice(5,7);
        var day = date.slice(8,10);
        var minTime = String(year) + String(month) + String(day) + "T00:00:00Z";
        var maxTime = String(year) + String(month) + String(day) + "T23:59:59Z";

        return [minTime,maxTime];

    },

    getTodaysDate : function() {
        var date = new Date();

        year = String(date.getFullYear())
        month = ('0' + (date.getMonth()+1)).slice(-2)
        day = ('0' + date.getDate()).slice(-2) // slice will always return the last 2, so who cares if it is 002?

        return String(year) + String(month) + String(day);
    },

    getTodaysSchedule : function(todaysDate,body) {
        var bodyArray = body.split('\n')
        var id = 1 //Need to take the database id instead of this.
        var json = { 'tasks' : []};
        for (var i = 0, len = bodyArray.length; i < len; i++) {
            var time = "Time: ";
            if (bodyArray[i].slice(0,7) === "DTSTART" && bodyArray[i].slice(27,35) === todaysDate) {
                var summary = bodyArray[i+9].replace(" ", "");
                if (summary.slice(summary.length-6,summary.length-5) === "P") {
                    summary = summary.slice(8, -9) + " - Practical";
                }  
                else {
                    summary = summary.slice(8, -9);
                }
                var date = bodyArray[i+1].slice(-16,-8);
                var description = bodyArray[i+10].slice(12,-1)

                var location = bodyArray[i+11].slice(9,bodyArray[i+11].length-2)

                var starttime = bodyArray[i].slice(-7,-3);
                starttime = starttime.slice(0, 2) + "." + starttime.slice(2, starttime.length);

                var endtime = bodyArray[i+1].slice(-7,-3);
                endtime = endtime.slice(0, 2) + "." + endtime.slice(2, endtime.length);

                json['tasks'].push({"id": id, "date": date,"code":summary,"title" : description,"startTime": starttime, "endTime": endtime,"location" : location,"completed": 0})
            }
        }
        return json;
    },

    getTodaysScheduleAndroid : function(todaysDate,body) {
        var bodyArray = body.split('\n')
        var id = 1 //Need to take the database id instead of this.
        var json = [];
        for (var i = 0, len = bodyArray.length; i < len; i++) {
            var time = "Time: ";
            if (bodyArray[i].slice(0,7) === "DTSTART" && bodyArray[i].slice(27,35) === todaysDate) {
                var summary = bodyArray[i+9]
                if (summary.slice(summary.length-6,summary.length-5) === "P") {
                    summary = bodyArray[i+9].slice(8, -9) + " - Practical";
                }  
                else {
                    summary = bodyArray[i+9].slice(8, -9);
                }
                var date = bodyArray[i+1].slice(-16,-8);
                var description = bodyArray[i+10].slice(12,-1)

                var location = bodyArray[i+11].slice(9,bodyArray[i+11].length-2)

                var starttime = bodyArray[i].slice(-7,-3);
                starttime = starttime.slice(0, 2) + "." + starttime.slice(2, starttime.length);

                var endtime = bodyArray[i+1].slice(-7,-3);
                endtime = endtime.slice(0, 2) + "." + endtime.slice(2, endtime.length);

                json.push({"id": id, "date": date,"code":summary,"title" : description,"startTime": starttime, "endTime": endtime,"location" : location, "completed": 0})
            }
        }
        return json;
    },

    getAllClasses : function(body) {
        var bodyArray = body.split('\n')
        var id = -1
        var json = { 'tasks' : [
        ]};
        for (var i = 0, len = bodyArray.length; i < len; i++) {
            var time = "Time: ";
            if (bodyArray[i].slice(0,12) === "BEGIN:VEVENT") {
                var date = bodyArray[i+1].slice(-16,-8);
                var summary = bodyArray[i+10]
                if (summary.slice(summary.length-6,summary.length-5) === "P") {
                    summary = bodyArray[i+10].slice(8, -9) + " - Practical";
                }  
                else {
                    summary = bodyArray[i+10].slice(8, -9);
                }
                id++
                var description = bodyArray[i+11].slice(12,-1)

                var location = bodyArray[i+12].slice(9,bodyArray[i+12].length-2)
                console.log(bodyArray[i+12]);

                var starttime = bodyArray[i+1].slice(-7,-3);
                starttime = starttime.slice(0, 2) + "." + starttime.slice(2, starttime.length);

                var endtime = bodyArray[i+2].slice(-7,-3);
                endtime = endtime.slice(0, 2) + "." + endtime.slice(2, endtime.length);

                json['tasks'].push({"id": id, "date": date,"code":summary,"title" : description,"startTime": starttime, "endTime": endtime,"location" : location,"completed": 0})
            }
        }
        return json;
    },
    
    //DATABASE
    createUser : function(OAuth, payload) {
        var MongoClient = require('mongodb').MongoClient;
        
        var fName = payload.given_name;
        var sName = payload.family_name;
        var emailAddr = payload.email;
        var userID = payload.sub;
        var basic = payload;
        
        MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
            if(err) { return console.dir(err); }
            var collection = db.collection('users');
            collection.insert({
                
                firstName : fName,
                secondName : sName,
                email : emailAddr,
                userId : userID,
                            
                oAuth : OAuth,
                basicInfo : basic,
                
                eventsList:[],
                recipes:[],
                finance:[]
                
                })  
            db.close();
        });
        return "success"
    },
    //DATABASE
    
    //DATABASE
    checkUser : function(userID,cb){
        var MongoClient = require('mongodb').MongoClient;
        
        return MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero').then(function(db) {
            //SPECIFIES DATABASE COLLECTION TO USE
            var collection = db.collection('users');
            
            return collection.find({userId: userID}).toArray((err, items) => {
                return cb(items);
            });
        });
    },
    //DATABASE

    //DATABASE
    getUser : function(userID,cb){
        var MongoClient = require('mongodb').MongoClient;
        return MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero').then(function(db) {
            var collection = db.collection('users');
            return collection.find({userId: userID}).toArray((err, user) => {
                return cb(user);
            });
        });
    },
    //DATABASE
/*
    //DATABASE
    getUser: function(cb) {
        var MongoClient = require('mongodb').MongoClient;
        return MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero').then(function(db) {
            var collection = db.collection('users');
            return collection.find({userId: "111728940496984531455"}).toArray((err, user) => {
                return cb(user[0]);
            });
        });
    },
    //DATABASE
*/
    //DATABASE
    removeUser : function(userID) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
            if(err) { return console.dir(err); }
            var collection = db.collection('users');
            collection.remove({userId : userID})
            db.close();
        });
        return "success"
    },
    //DATABASE
    
    //DATABASE
    updateUser : function(user,data) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
            if(err) { return console.dir(err); }
            var collection = db.collection('users');
            collection.updateOne({userId:user},{
                $push: {
                    "eventsList": data
                    }
                });
            db.close();
            });
    },
    
    addCalendarListUser : function(user,data) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
            if(err) { return console.dir(err); }
            var collection = db.collection('users');
            collection.updateOne({userId:user}, {
                $set:{
                    "calendarList": data
                    }
                });
            db.close();
            });
    },
    //DATABASE
    
    //DATABASE
    addAllClassesToDatabase : function(body) {
        var MongoClient = require('mongodb').MongoClient;
        // CONNECTS TO DATABAS
        MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
            if(err) { return console.dir(err); }
            //SPECIFIES DATABASE COLLECTION TO USE
            var collection = db.collection('users');
            //PARSES DATA TASK BY TASK
            var bodyArray = body.split('\n')
            var currentId = -1
            for (var i = 0, len = bodyArray.length; i < len; i++) {
                var time = "Time: ";
                if (bodyArray[i].slice(0,12) === "BEGIN:VEVENT") {
                    var currentDate = bodyArray[i+1].slice(-16,-8);
                    var summary = bodyArray[i+10].replace(" ", "");
                    if (summary.slice(summary.length-6,summary.length-5) === "P") {
                        summary = summary.slice(8, -9) + " - Practical";
                    }  
                    else {
                        summary = summary.slice(8, -10);
                    }
                    currentId++
                    var description = bodyArray[i+11].slice(12,-1)

                    var loc = bodyArray[i+12].slice(9,bodyArray[i+12].length-2)

                    var start = bodyArray[i+1].slice(-7,-3);
                    start = start.slice(0, 2) + ":" + start.slice(2, start.length);

                    var end = bodyArray[i+2].slice(-7,-3);
                    end = end.slice(0, 2) + "." + end.slice(2, end.length);
                    //ADDS EACH TASK INDIVIDUALLY TO DATABASE
                    collection.update({username:"kumaran"},{
                            $push: {
                                tasks: {
                                    id:currentId,
                                    date:currentDate,
                                    code:summary,
                                    title:description,
                                    startTime:start,
                                    endTime:end,
                                    location:loc,
                                    completed:+"0"
                                }
                            }
                    });
                }
            }
            //CLOSES CONNECTION
            db.close();
        });
        //RETURNS SUCCESSFUL ADDITION
        return {'tasks':["Added to database"]}
    },
    //DATABASE
    
    //DATABASE
    updateTask: function(user,taskID,field){
    // CONNECTS TO DATABASE
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://assero:k00m4r4n@127.0.0.1:27017/assero', function(err, db) {
        if(err) { return console.dir(err); }
        //SPECIFIES DATABASE COLLECTION TO USE
        var collection = db.collection('users');
        console.log(collection)
        var userTasks = collection.find()[user].tasks;
        console.log(userTasks)
        var key = "id"
        var value = taskID.toString();
        var json = { 'tasks' : []};
        for (var obj in userTasks){
            if (obj.hasOwnProperty(key) && obj[key] === value){
                //CODE FOR UPDATING
                }
            }
        db.close();
        });
    },
    //DATABASE

    checkAccessToken: function(userId) {
        userDbMethods.getTokens(userId, (err,tokens) => {
            if (err) {
                return console.log(err);
            }
            var myOAuth2Client = gAuth.getOAuth2Client();
            myOAuth2Client.setCredentials(tokens);
            myOAuth2Client.getAccessToken(function(err, tokens) {
                if (err) {
                    console.log("Error with refreshing access token: " + err);
                }
                else {
                    userDbMethods.updateAccessToken(userId, myOAuth2Client.credentials.access_token);
                }
            });
        });
    },
    
    generatePassword : function (cb) {
        var url = 'https://passwordwolf.com/api/?special=off&phonetic=off&length=10&repeat=1'
        request(url, function(err, html) {
            if (err) {
                console.log("Error generating password - " + err);
            } else {
                var password = JSON.parse(html.body)[0].password
                cb(password)
            }
        })
    },

    
    generateUrl : function(dict, cb) {
        var string = ""
        for (key in Object.keys(dict)) { 
            string += (key + "=" + dict[key] + "&");
        }
        return cb(string.slice(0, -1));
    },

    grabObjectKeys : function(object, value) {
        var result = []
        for (i in object) {
            if (object[i] === value) {
                result.push(i)
            }
        }
        return result
    },

    checkUser : function(req, res, next) {
        console.log("Checking User")
        const getUserId = req.params.userId || null
        const postUserId = req.body.userId || null
        if (getUserId) {
            var userId = getUserId
        } else if (postUserId) {
            var userId = postUserId
        } else if (!(getUserId && postUserId)) {
            return next() 
        };
        userDbMethods.checkUser(userId, err => {
            if (err) {
                return res.status(200).send(err);
            }
            next();
        });
    },
}
