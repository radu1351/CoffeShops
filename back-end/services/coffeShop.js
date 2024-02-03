const db = require('../config/db');

const querycoffeShopById = async(id) => {
    db.collection("coffeShops").doc(id)
        .get().then(snapshot => {
            return snapshot.data();
        }).catch(err => {
            console.log("Error occured: " + err);
        });
};

module.exports = { querycoffeShopById };