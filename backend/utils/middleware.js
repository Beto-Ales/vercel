const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method', request.method)
    logger.info('Path', request.path)
    logger.info('Body', request.body)
    logger.info('---')
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const decodedToken = request => {
    return jwt.verify(request.token, process.env.SECRET)
}

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    logger.info('token', request.token)
    next()
}

const userExtractor = async (request, response, next) => {
    request.user = await User.findById(decodedToken(request).id)
    logger.info('user', request.user.toString())
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
// this should be done from the frontend
// const calcSpecialHours = (request, response, next) => {
//     request.body.grid[0].row[0].totalNormal = request.body.grid[0].row[0].startWork * 2
//     request.body.grid[0].row[0].totalSpecial = request.body.grid[0].row[0].endWork * 3
//     console.log('startWork', request.body.grid[0].row[0].startWork, 'totalNormal', request.body.grid[0].row[0].totalNormal, 'totalSpecial', request.body.grid[0].row[0].totalSpecial);
//     next()
// }

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
    // calcSpecialHours
}