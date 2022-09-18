const bcrypt = require('bcrypt')
const createUsersRouter = require('express').Router()
const User = require('../models/user')

createUsersRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,        
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = createUsersRouter