const express = require('express')
const config = require("./config/mongoose")

const port = 3005
const app = express()
config.connect()

app.use(express.json())

app.get('*', (req, res) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})

app.listen(port, () => console.log(`listening on port: ${port}`))