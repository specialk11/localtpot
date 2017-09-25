const userDbMethods = require('../userMethods');
const financeDbMethods = require('./financeDbMethods');

module.exports = {
    week,
    day,
    insert,
    update,
    remove
}

function week(req, res) {
    const userId = req.params.userId;
    const weekStart = req.params.weekStart;
    financeDbMethods.getWeek(userId, weekStart, (err, week) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(week);
    });
}

function day(req, res) {
    const userId = req.params.userId;
    const day = req.params.day;
    financeDbMethods.getDay(userId, day, (err, day) => {
        if (err) {
            return res.status(err.error).send(err);
        }
        return res.status(200).send(day);
    });
}

function insert(req, res) {
    const userId = req.body.userId;
    const input = req.body.input;
    financeDbMethods.insertItem(userId, input, (err, result) => {
        if (err) {
             return res.status(err.error).send(err);
        }
        return res.status(result.status).send(result);
    });
}

function update(req, res) {
    const userId = req.body.userId;
    const input = req.body.input;
    financeDbMethods.insertItem(userId, input, (err, result) => {
        if (err) {
             return res.status(err.error).send(err);
        }
        return res.status(result.status).send(result);
    });
}

function remove(req, res) {
    const userId = req.body.userId;
    const input = req.body.input;
    financeDbMethods.removeItem(userId, input, (err, result) => {
        if (err) {
             return res.status(err.error).send(err);
        }
        return res.status(result.status).send(result);
    });
}