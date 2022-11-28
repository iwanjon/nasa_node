const express = require('express');
const planetsRouter = require('./planets/planets.router')
const launchsRouter = require('./launches/launches.router')


const api = express.Router()
api.use("/planets",planetsRouter);
api.use("/launches",launchsRouter);


module.exports = {
    api
}