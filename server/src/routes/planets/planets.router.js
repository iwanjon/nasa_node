const express = require('express');


const { getAllPlanets } =require('./planets.controller')


planetsRouter = express.Router();

planetsRouter.get('/', getAllPlanets);



module.exports = planetsRouter 