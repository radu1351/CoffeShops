const faker = require('faker');
const db = require('../config/db');

const controller = {
    generateFakecoffeShopsData: async(req, res) => {
        try {
            const amount = req.params.coffeShops_amount;
            for (let i = 0; i < amount; i++) {
                const fakecoffeShop = {
                    name: faker.company.companyName() + " " + faker.random.arrayElement(['Cafe', 'Coffee', 'Shop']),
                    adress: faker.address.streetAddress(),
                    atmosphere: faker.random.arrayElement(['Cozy', 'Modern', 'Rustic', 'Urban']),
                    menu: faker.lorem.words(3),
                };
                await db.collection('coffeShops').add(fakecoffeShop);
            }
            res.status(201).send({ message: "coffeShops Data generated!" });
        } catch (err) {
            res.status(500).send({ message: "Server error: " + err });
        }
    },

    getAllcoffeShops: async(req, res) => {
        try {
            const coffeShopsSnapshot = await db.collection('coffeShops').get();
            const coffeShopsResponse = [];
            coffeShopsSnapshot.forEach(doc => {
                coffeShopsResponse.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            res.status(200).send(coffeShopsResponse);
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    },

    getcoffeShop: async(req, res) => {
        try {
            const coffeShopSnapshot = await (await db.collection('coffeShops').doc(req.params.coffeShop_id).get()).data();
            res.status(200).send(coffeShopSnapshot);
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    },

    deletecoffeShop: async(req, res) => {
        try {
            await db.collection('coffeShops').doc(req.params.coffeShop_id).delete();
            res.status(200).send({ message: "Coffe Shop Deleted" });
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    },

    editcoffeShop: async(req, res) => {
        try {
            const editedcoffeShop = {
                name: req.body.name,
                adress: req.body.adress,
                atmosphere: req.body.atmosphere,
                menu: req.body.menu,
            
            };
            if (editedcoffeShop.name || editedcoffeShop.adress || editedcoffeShop.atmosphere || editedcoffeShop.menu) {
                let finalEdit = {};
                for (let prop in editedcoffeShop) {
                    if (editedcoffeShop[prop]) {
                        finalEdit[`${prop}`] = editedcoffeShop[prop];
                    }
                }
                await db.collection('coffeShops').doc(req.params.coffeShop_id).update(finalEdit);
                res.status(200).send({ message: "coffeShop data updated" });
            } else {
                res.status(400).send({ message: "You must provide at least one updated field" });
            }
        } catch (err) {
            res.status(500).send({ message: `Server error: ${err}` });
        }
    }
};

module.exports = controller;