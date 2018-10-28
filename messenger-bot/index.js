require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const webhooks = require('./webhooks')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/webhook', webhooks)

app.listen(process.env.APP_PORT, () => console.log(`Server Running on ${process.env.APP_PORT}`))
