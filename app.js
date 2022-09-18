const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')


// replace routers
// ---------------
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const createUsersRouter = require('./controllers/createUser')
// ---------------

const hoursRouter = require('./controllers/hours')


const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
// app.use(middleware.calcSpecialHours) should be done by the frontend


app.use('/api/login', loginRouter)  // declare this first to avoid token problems
app.use('/api/createUser', createUsersRouter)    // declare this first to avoid token problems

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/hours', hoursRouter)
app.use('/api/users', usersRouter)





app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
