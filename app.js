import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import { initializePassport } from './passport.config.js'
import passport from 'passport'

const app = express()
const server = app.listen(8080, () => console.log('Server Up'))

const connection = mongoose.connect("mongodb://localhost:27017/back25users", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let baseSession = session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/back25sessions'}),
    secret: 'c0d3r',
    resave: true,
    saveUninitialized: true
})

app.use(express.json())
app.use(baseSession)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.post('/register', passport.authenticate('register', { failureRedirect: '/failedRegister'}), (req, res) => {
    res.send({ message: "Signed Up"})
})

app.post('/failedRegister', (req, res) => {
    res.send({ error: "I cannot authenticate you"})
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin'}), (req, res) => {
    res.send({ message: "Logged In"})
})

app.post('/failedLogin', (req, res) => {
    res.send({ error: "I cannot log in"})
})

app.get('/logout', (req, res) => {
    req.logout()
})