const dotenv = require('dotenv');
dotenv.config({ path: './token.env' });
const secretKey = process.env.TOKEN_SECRET;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authService = require('../services/authUsers');

const controller = {
    registerUser: async(req, res) => {
        const foundUser = await authService.queryByEmail(req.body.email);
        if (foundUser.email) {
            res.status(409).send({ message: "User already registered" });
        } else {
            try {
                const newUser = {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: bcrypt.hashSync(req.body.password, 10)
                };
                await db.collection('users').add(newUser);
                res.status(201).send({ message: "User registered!" });
            } catch (err) {
                res.status(500).send("Server error: " + err);
            }

        }
    },

    loginUser: async(req, res) => {
        const foundUser = await authService.queryByEmail(req.body.email);
        if (foundUser.email) {
            const validPassword = bcrypt.compareSync(req.body.password, foundUser.password);
            if (validPassword) {
                const token = jwt.sign({ id: foundUser.id }, secretKey, { expiresIn: "4h" });
                res.status(200).send({ userId: foundUser.id, token: token, message: "Logged in!" });
            } else {
                res.status(401).send({ message: "Invalid credentials(password)" });
            }
        } else {
            res.status(401).send({ message: "Invalid credentials(email)" });
        }
    }
};

module.exports = controller;