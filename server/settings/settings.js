
const userDbMethods = require('../userMethods');
const dataDbMethods = require('../dataMethods');

module.exports = {
    updateSettings,
    courseSettings,
    removeSociety,
    insertSocieties,
    getSettings
}

function updateSettings(req, res) {
    var userId = req.body.userId;
    var settings = req.body.settings;
    userDbMethods.updateSettings(userId, settings)
    return res.status(200).send({status:200, message: "Settings updated"})
}

function courseSettings(req, res) {
    var userId = String(req.body.userId);
    var college = String(req.body.college);
    var name = String(req.body.course);
    var year = String(req.body.year);
    dataDbMethods.getModules(college.toUpperCase(), name.toUpperCase() + year, (err, modules) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        console.log(modules)
        userDbMethods.updateCourse(userId, college.toUpperCase(), name.toUpperCase(), year, modules)
    })
    return res.status(200).send({status:200, message:"Course details updated"})
}

function removeSociety(req, res) {
    var userId = req.body.userId;
    var society = req.body.society;
    userDbMethods.removeSociety(userId, society);
    userDbMethods.getSettings(userId, (err, settings) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        const college = settings.course.college
        dataDbMethods.removeSubscriber(college, society, userId)
    })
    return res.status(200).send({message: "Successfully un-subscribed from: " + String(society)})
}

function insertSocieties(req, res) {
    var userId = req.body.userId;
    var societies = req.body.societies;
    userDbMethods.insertSocieties(userId, societies);
    userDbMethods.getSettings(userId, (err, settings) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        const college = settings.course.college
        for (var i = 0; i < societies.length; i++)
            dataDbMethods.insertSubscriber(college, societies[i], userId)
    })
    return res.status(200).send({message: "Successfully subscribed to: " + String(societies)})
}

function getSettings(req, res) {
    var userId = req.params.userId;
    userDbMethods.getSettings(userId, (err, settings) => {
        if (err) {
            return res.status(err.error).send(err)
        }
        return res.status(200).send(settings)
    })
}