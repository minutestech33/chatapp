require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const router = require('./routes/ChatRoute')

const app = express()
const middleware = [
    express.urlencoded({ extended: true }),
    express.json(),
    morgan('dev'),
    cors(),
    router
]
app.use(middleware)

const PORT = process.env.PORT || 9090
mongoose.connect(process.env.URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    if (mongoose.connection) {
        console.log('Database connected')
        app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`))
    }
}).catch((err) => {
    console.log(err)
})

