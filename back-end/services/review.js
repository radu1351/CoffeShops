const db = require('../config/db');

const queryReviewByUserId = async(coffeShopId, id) => {
    const foundReview = db.collection("coffeShops").doc(coffeShopId).collection('reviews').where('userId', '==', id)
        .get().then(snapshot => {
            let review = {};
            snapshot.forEach(doc => {
                review = doc.data();
                review.id = doc.id;
            });
            return review;
        }).catch((err) => {
            console.log("Error occured: " + err);
        });

    return foundReview;
};

module.exports = { queryReviewByUserId };