const { firestore } = require('firebase-admin');
const db = require('../config/db');

const queryByEmail = async(email) => {
    const foundUser = db.collection("users").where('email', '==', email)
        .get().then(snapshot => {
            let user = {};
            snapshot.forEach(doc => {
                user = doc.data();
                user.id = doc.id;
            });
            return user;
        }).catch((err) => {
            console.log("Error occured: " + err);
        });

    return foundUser;
};

const queryById = async(uid) => {
    const foundUser = db.collection("users").doc(uid)
        .get().then(snapshot => {
            let user = snapshot.data();
            return user;
        }).catch((err) => {
            console.log("Error occured: " + err);
        });

    return foundUser;
};

module.exports = { queryByEmail, queryById };