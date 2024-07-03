//Defines the routes for signup and login.

const express = require ('express');


 //imported from auth.js of controller.
const {signup , login}= require('../controller/auth.js');
const router = express.Router();

router.post('/signup', signup);
router.post('/login' , login);

module.exports= router;