"use strict";
const mongodb = require('mongodb');

function callBack(err, cb) {
  if (err) {
    console.log(err)
    return err();
  }
  return cb();
}

class dbConstructor {
    constructor(collection) {
        this.onLoad = _ => true;

    mongodb.connect('mongodb://127.0.0.1:27017', (err, db) =>
        callBack(err, _ => {
            this.coll = db.collection(collection);
            this.onLoad();
        })
    )};

    find(selector, cb) {
        return this.coll.find(selector).toArray((err, data) => callBack(err, _ => cb(data)));
    }

    findSorted(selector, sorter, cb) {
        return this.coll.find(selector).sort(sorter).toArray((err, data) => callBack(err, _ => cb(data)));
    }

    findOne(selector, cb) {
        return this.coll.find(selector).limit(1).toArray((err, data) => callBack(err, _ => cb(data[0])));
    }

    findOneSorted(selector, sorter, cb) {
        return this.coll.find(selector).sort(sorter).limit(1).toArray((err, data) => callBack(err, _ => cb(data[0])));
    }

    insert(data) {
        this.coll.insertOne(data);
    }

    update(selector, action) {
        this.coll.updateOne(selector, action);
    }

    remove(selector) {
        this.coll.removeOne(selector);
    }

    upsert(selector, action, cb) {
        return this.coll.updateOne(selector, action, {upsert: true}, (err, data) => callBack(err, _ => cb(data)));
    }

    findAndModify(selector, action, cb) {
        return this.coll.findAndModify(selector, [], action, {upsert: true}, (err, data) => callBack(err, _ => cb(data)));
    }
};

module.exports = {create: dbConstructor};
