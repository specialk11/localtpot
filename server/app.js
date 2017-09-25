const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const request = require("request")
const cors = require('cors');
const google = require('googleapis');
const cron = require('node-cron');
const async = require('async');
const helmet = require('helmet');
const uuid = require('uuid');
const cheerio = require('cheerio');
const gAuth = require('./DO_NOT_ADD_TO_REPO/googleAuthKeys');
const gCal = google.calendar('v3');
const googleMethods = require('./tasks/googleMethods');
const googleMapsMethods = require('./maps/googleMapsMethods');
const usefulMethods = require('./usefulMethods');
const userDbMethods = require('./userMethods');
const trendingMethods = require('./trending/trendingMethods');
const trendingDbMethods = require('./trending/trendingDbMethods');
const mongoDbMethods = require('./mongoDB');
const recipeMethods = require('./recipes/recipeMethods');
const recipeDbMethods = require('./recipes/recipeDbMethods');
const financeMethods = require('./finance/financeMethods');
const financeDbMethods = require('./finance/financeDbMethods');
const dataDbMethods = require('./dataMethods');
const collegeTimetableMethods = require('./college/collegeTimetableMethods');
const collegeSocMethods = require('./college/collegeSocMethods');
const settingMethods = require('./settings/settings')
var url = require('url')
var path = require('path')
var baseDirectory = __dirname 

module.exports = app

app.use(helmet())
app.use(express.static('../webapp/public'));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

   // or whatever base directory you want


http.createServer(app, function (request, response) {
   
}).listen(8080)

console.log("listening on port "+8080)



// CONSOLE LOGS THAT SERVER IS IDLE //
app.use(function (req, res, next) {
    console.log("Server is waiting for input....\nTime:", Date())
    next()
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////COLLEGE CALLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const dcuCourses = ["3UMHCT1","3UMHLM2","AC1","AC2","AC3","AC4","ACM1","ACM2","ACM3","ACM4","AF1","AF2","AF3","ALISI4","ALIST4","ALTS1","ALTS2","AMPS1","AMPS2","AMPS3","AMPS4","AP1","AP2","AP3","AP4","AS1","AS2","AS3","AS4","ATT1","ATT2","ATT3","ATT4","BAISRS3","BAJH1","BAJI1","BAJL1","BAJM1","BAJP1","BATLEC","BCL1","BCL2","BCL3","BCLYA4","BED1","BET2","BET3","BHS1","BHS2","BHS3","BMED1","BMED2","BMED3","BMED4","BMEDV5","BNCG1","BNCG2","BNCG3","BNCG4","BNGN1","BNGN2","BNGN3","BNGN4","BNID1","BNID2","BNID3","BNID4","BNPY1","BNPY2","BNPY3","BNPY4","BPY1","BPY2","BPY3","BPY4","BRE1","BREDE3","BREDH3","BREDM3","BRH1","BRM1","BS1","BS2","BS3","BSI4","BT1","BT2","BT3","BT4","CA1","CAFM1","CAM1","CAM2","CAM3","CAM4","CAMMC","CAMQC","CASE2","CASE3","CASE4","CCS1","CCS2","CCS3","CCSYA4","CCT1","CE1","CES1","CPSSD1","CPSSD2","CS1","CS2","CS3","DPSY1","DPSY3","EBC1","EBF1","EBF2","EBF3","EBF4","EBG1","EBG2","EBG3","EBG4","EBS1","EBS2","EBS4","EBT1","EBT2","EBT3","EBT4","EC1","EC2","EC3","EC4","ECE1","ECE2","ECE3","EMM2","ENGLIC2","ENGLIC3","EPL1","EPL2","EPL3","EPLYA4","ESH1","ESH2","ESH3","ESH4","ESPD1","ESPD2","ESPD6","ESPD7","ESPD8","ESPM4","ESPT1","ET1","ET2","ET3","ETF3","ETF4","FIM3","FIM4","FM2","FM3","FM4","FRGF4","GAP1","GCB1","GCB2","GCB3","GCB4","GCCSCS1","GCDEV1","GCDF2","GCDFC","GCESC","GCETHH1","GCISE1","GDF1","GDMHPC","GDPCC","GDREPW1","GG1","GG2","GG3","GG4","GI1","GI2","GI3","GMO1","HOR4","IBLFGS4","IBLFS2","IBLFS4","IBLGS1","IBLGS3","IBLJ3","IFCAF1","IFCBLJ1","IFCBS1","IFCCA1","IFCCES1","IFCEPL1","IFCIR1","IFCLCE1","IFCLIS1","IFCMME1","IFPBM1","IFPBMD1","IFPCL1","IFPES1","IFPFIM1","IFPMBE1","IFPMCM1","IFPMIR1","IFPSBM1","IFPSCM1","IFPSES1","IFPSIC1","IFPSIR1","IFPTE1","IMLGS4","IMLJ3","INTB1","INTB2","INTB3","INTB4","IR1","IR2","IR3","IRYA4","JHIIL3","JHLFR2","JHLIR3","JHLMS3","JHMSI3","JHPIL3","JR1","JR2","JR3","LOA3","LOA4","MACL1","MACSPW1","MAEDRC","MAENR1","MAENR3","MAETCR1","MAETCR2","MAETH1","MAETH2","MAETHC","MAGB1","MAJ1","MAP1","MAPS1","MAPS2","MARCETC","MARCPH1","MARCPHC","MARCTP1","MARCTP2","MAREDL1","MAREML1","MAREML2","MAREMLC","MAREPP1","MAREPPC","MAREPW1","MAREPWC","MARERE1","MASS1","MATH1","MATH2","MBA1","MBD1","MBS1","MCM1","MCMC","MCOU1","MCOU2","MCOU3","MCOU4","MCPA1","MCPAC","MCTC","MDEV1","MDEV2","MDF1","ME2","ME3","ME4","MECB1","MECT1","MEME1","MEME2","MEML1","MEML2","MENC","MFCM1","MFM1","MGC2","MGNPC","MHRM1","MIA2","MIC2","MIN1","MINT1","MINT2","MINT4","MINTD2","MIR1","MIR2","MISC1","MISMC","MITB1","MITB2","MMA1","MMA2","MMA3","MMA4","MMACC","MMHNP1","MMHNPC","MMHPC","MMM1","MMO1","MMP2","MOCLD2","MOPSC","MOPSDC","MP2","MP4","MPAL6","MPO2","MPVC","MREPC","MSAL1","MSBE1","MSBEC","MSBM1","MSC1","MSC2","MSDC","MSDM2","MSE1","MSED1","MSEF1","MSEF2","MSGC1","MSGC2","MSMS1","MSOB2","MTS1","MTT1","MTV1","MTV2","MWB2","MWB3","MWB4","NSPM5","NSPT1","PBM1","PBM2","PBM3","PBM4","PDPB1","PDPE2","PDTHT2","PDTHT3","PEB1","PEB3","PEB4","PEM2","PEM3","PHA1","PHA2","PHA3","PHA4","PME1","PME2","RMSAX","SAMPBC","SAMPSC","SE1","SE2","SE3","SE4","SMDCADC","SMPB1","SPDA3","SPDE3","SPDE4","SPDW2","SSH1","SSH2","SSH3","SSH4","TC2","TCD1"]
// var i = 0;
// const dcuCourses = ["3UMHCT1","3UMHLM2","AC1","AC2","AC3","AC4","ACM1","ACM2","ACM3","ACM4","AF1","AF2","AF3","ALISI4","ALIST4","ALTS1","ALTS2","AMPS1","AMPS2","AMPS3","AMPS4","AP1","AP2","AP3","AP4","AS1","AS2","AS3","AS4","ATT1","ATT2","ATT3","ATT4","BAISRS3","BAJH1","BAJI1","BAJL1","BAJM1","BAJP1","BATLEC","BCL1","BCL2","BCL3","BCLYA4","BED1","BET2","BET3","BHS1","BHS2","BHS3","BMED1","BMED2","BMED3","BMED4","BMEDV5","BNCG1","BNCG2","BNCG3","BNCG4","BNGN1","BNGN2","BNGN3","BNGN4","BNID1","BNID2","BNID3","BNID4","BNPY1","BNPY2","BNPY3","BNPY4","BPY1","BPY2","BPY3","BPY4","BRE1","BREDE3","BREDH3","BREDM3","BRH1","BRM1","BS1","BS2","BS3","BSI4","BT1","BT2","BT3","BT4","CA1","CAFM1","CAM1","CAM2","CAM3","CAM4","CAMMC","CAMQC","CASE2","CASE3","CASE4","CCS1","CCS2","CCS3","CCSYA4","CCT1","CE1","CES1","CPSSD1","CPSSD2","CS1","CS2","CS3","DPSY1","DPSY3","EBC1","EBF1","EBF2","EBF3","EBF4","EBG1","EBG2","EBG3","EBG4","EBS1","EBS2","EBS4","EBT1","EBT2","EBT3","EBT4","EC1","EC2","EC3","EC4","ECE1","ECE2","ECE3","EMM2","ENGLIC2","ENGLIC3","EPL1","EPL2","EPL3","EPLYA4","ESH1","ESH2","ESH3","ESH4","ESPD1","ESPD2","ESPD6","ESPD7","ESPD8","ESPM4","ESPT1","ET1","ET2","ET3","ETF3","ETF4","FIM3","FIM4","FM2","FM3","FM4","FRGF4","GAP1","GCB1","GCB2","GCB3","GCB4","GCCSCS1","GCDEV1","GCDF2","GCDFC","GCESC","GCETHH1","GCISE1","GDF1","GDMHPC","GDPCC","GDREPW1","GG1","GG2","GG3","GG4","GI1","GI2","GI3","GMO1","HOR4","IBLFGS4","IBLFS2","IBLFS4","IBLGS1","IBLGS3","IBLJ3","IFCAF1","IFCBLJ1","IFCBS1","IFCCA1","IFCCES1","IFCEPL1","IFCIR1","IFCLCE1","IFCLIS1","IFCMME1","IFPBM1","IFPBMD1","IFPCL1","IFPES1","IFPFIM1","IFPMBE1","IFPMCM1","IFPMIR1","IFPSBM1","IFPSCM1","IFPSES1","IFPSIC1","IFPSIR1","IFPTE1","IMLGS4","IMLJ3","INTB1","INTB2","INTB3","INTB4","IR1","IR2","IR3","IRYA4","JHIIL3","JHLFR2","JHLIR3","JHLMS3","JHMSI3","JHPIL3","JR1","JR2","JR3","LOA3","LOA4","MACL1","MACSPW1","MAEDRC","MAENR1","MAENR3","MAETCR1","MAETCR2","MAETH1","MAETH2","MAETHC","MAGB1","MAJ1","MAP1","MAPS1","MAPS2","MARCETC","MARCPH1","MARCPHC","MARCTP1","MARCTP2","MAREDL1","MAREML1","MAREML2","MAREMLC","MAREPP1","MAREPPC","MAREPW1","MAREPWC","MARERE1","MASS1","MATH1","MATH2","MBA1","MBD1","MBS1","MCM1","MCMC","MCOU1","MCOU2","MCOU3","MCOU4","MCPA1","MCPAC","MCTC","MDEV1","MDEV2","MDF1","ME2","ME3","ME4","MECB1","MECT1","MEME1","MEME2","MEML1","MEML2","MENC","MFCM1","MFM1","MGC2","MGNPC","MHRM1","MIA2","MIC2","MIN1","MINT1","MINT2","MINT4","MINTD2","MIR1","MIR2","MISC1","MISMC","MITB1","MITB2","MMA1","MMA2","MMA3","MMA4","MMACC","MMHNP1","MMHNPC","MMHPC","MMM1","MMO1","MMP2","MOCLD2","MOPSC","MOPSDC","MP2","MP4","MPAL6","MPO2","MPVC","MREPC","MSAL1","MSBE1","MSBEC","MSBM1","MSC1","MSC2","MSDC","MSDM2","MSE1","MSED1","MSEF1","MSEF2","MSGC1","MSGC2","MSMS1","MSOB2","MTS1","MTT1","MTV1","MTV2","MWB2","MWB3","MWB4","NSPM5","NSPT1","PBM1","PBM2","PBM3","PBM4","PDPB1","PDPE2","PDTHT2","PDTHT3","PEB1","PEB3","PEB4","PEM2","PEM3","PHA1","PHA2","PHA3","PHA4","PME1","PME2","RMSAX","SAMPBC","SAMPSC","SE1","SE2","SE3","SE4","SMDCADC","SMPB1","SPDA3","SPDE3","SPDE4","SPDW2","SSH1","SSH2","SSH3","SSH4","TC2","TCD1"]
// const dcuCourses = ['CPSSD2']
// cron.schedule('*/5 * * * * *', function() {
//     if (i < dcuCourses.length) {
//     collegeTimetableMethods.getDCUCourse(dcuCourses[i], "20170410");
//     i++
//     }
// });

app.post('*', usefulMethods.checkUser)

const collegeRouter = express.Router();
app.use('/college', collegeRouter);

// GET BACK A USERS TIMETABLE FOR COLLEGE //
collegeRouter.get('/:userId/*', usefulMethods.checkUser)
collegeRouter.get('/:userId/:date', collegeTimetableMethods.getCourseDay)

const socRouter = express.Router();
app.use('/soc', socRouter);

// CHECK SOCS CREDENTIALS //

socRouter.post('/auth', collegeSocMethods.initialAuth);

socRouter.post('*', collegeSocMethods.auth);

// INSERT AN EVENT INTO SOCIETYS DATABASE //
socRouter.post('/insert', collegeSocMethods.insertSocEvent);

// REMOVE AN EVENT FROM SOCIETIES DATABASE //
socRouter.post('/remove', collegeSocMethods.removeSocEvent);

// UPDATE AN EVENT WITHIN A SOCIETIES DATABASE //
socRouter.post('/update', collegeSocMethods.updateSocEvent);

// GET BACK AN ARRAY OF SOCIETIES EVENTS //
socRouter.get('/getEvents/:college/:name', collegeSocMethods.getSocEvents);

// GET A LIST OF ALL SOCIETIES WITHIN A COLLEGE //
socRouter.get('/:userId', usefulMethods.checkUser)
socRouter.get('/:userId', collegeSocMethods.getSocs);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////GOOGLE CALLS////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CHECK IF USER ALREADY EXISTS IN THE DATABASE //
app.get('/checkUser/:userId', googleMethods.checkUser)

// INITIAL AUTHENTICATION WITH GOOGLES OAUTH //
app.post('/auth', googleMethods.auth);

const googleTasksRouter = express.Router();
app.use('/tasks', googleTasksRouter);

// ADDS A NEW EVENT //
googleTasksRouter.post('/insert', googleMethods.insertEvent);

// UPDATES A GIVEN TASK //
googleTasksRouter.post('/patch', googleMethods.patchEvent);

// REMOVES A GIVEN TASK //
googleTasksRouter.post('/remove', googleMethods.removeEvent);


// SYNC ALL GOOGLE AND LOCAL DATABASE TASKS //
googleTasksRouter.get('/sync/:userId', googleMethods.sync);

// GIVE BACK ALL GOOGLE EVENTS FOR THE DAY //
googleTasksRouter.get('/*/:userId/:date', usefulMethods.checkUser)
googleTasksRouter.get('/day/:userId/:date', googleMethods.getTodaysEvents)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////GOOGLE MAPS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTE SEARCH //
app.get('/maps/search', googleMapsMethods.search);

const googleMapsRouter = express.Router();
app.use('/transport', googleMapsRouter);

// //
googleMapsRouter.get('/test', googleMapsMethods.test);

// //
googleMapsRouter.get('/:latitude/:longitude', googleMapsMethods.getNearby);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////USER CALLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const settingsRouter = express.Router();
app.use('/settings', settingsRouter);

settingsRouter.post('/', settingMethods.updateSettings)

settingsRouter.post('/course', settingMethods.courseSettings);

settingsRouter.post('/insertSocs', settingMethods.insertSocieties);

settingsRouter.post('/removeSoc', settingMethods.removeSociety)

settingsRouter.get('/:userId', usefulMethods.checkUser)
settingsRouter.get('/:userId', settingMethods.getSettings)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////FINANCE CALLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const financeRouter = express.Router();
app.use('/finance', financeRouter);

financeRouter.post('/insert', financeMethods.insert);

financeRouter.post('/update', financeMethods.update);

financeRouter.post('/remove', financeMethods.remove);

financeRouter.get('/*/*/:userId', usefulMethods.checkUser)
financeRouter.get('/week/:weekStart/:userId', financeMethods.week);

financeRouter.get('/*/*/:userId', usefulMethods.checkUser)
financeRouter.get('/day/:day/:userId', financeMethods.day);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////RECIPES CALLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AT 6AM, GRAB POPULAR ITEMS PRICES FROM STORES //
cron.schedule('0 0 6 * * *', recipeMethods.storeOffers);

// REMOVES PREVIOUS DAYS SPECIAL OFFERS //
cron.schedule('0 59 5 * * *', trendingDbMethods.removeSpecials);


const recipesRouter = express.Router()
app.use('/recipes', recipesRouter);

// ADD TO FAVOURITES //
recipesRouter.post('/favourite', recipeMethods.addToFavourites);

// ASSIGN A MEAL TO A DAY IN THE WEEK //
recipesRouter.post('/insert', recipeMethods.insert);

// REMOVE A MEAL FROM A DAY IN THE WEEK //
recipesRouter.post('/remove', recipeMethods.remove);

// RANDOM JOKE //
recipesRouter.get('/joke', recipeMethods.recipeJoke);

// RANDOM FOOD TRIVIA //
recipesRouter.get('/trivia', recipeMethods.recipeTrivia);

// GET SPECIFICED RECIPES INSTRUCTIONS //
recipesRouter.get('/info/:id', recipeMethods.recipeInfo);

// INGREDIENTS SEARCH //
recipesRouter.get('/ingredientSearch/:text', recipeMethods.ingredientSearch);

// GET FAVOURITES BACK FROM SERVER //
recipesRouter.get('/favourites/:userId', recipeMethods.getFavourites);

// CHECK FOR VERIFYING USER //
recipesRouter.get('/*/:userId/*', usefulMethods.checkUser)

// RECIPE SEARCH //
recipesRouter.get('/search/:userId/:text', recipeMethods.search);

// GET TODAYS MEALS //
recipesRouter.get('/getDay/:userId/:day', recipeMethods.getDays);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////TRENDING CALLS///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const trendingRouter = express.Router();
app.use('/trending', trendingRouter);

// //
trendingRouter.get('/searches/', trendingMethods.searches);

// //
trendingRouter.get('/meals/', trendingMethods.meals);

app.get('/specials', trendingMethods.specials);

app.use(function(req, res) {
    res.status(404).send("Sorry, can't seem to find that page");
});