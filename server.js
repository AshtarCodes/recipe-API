const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const recipes = require('./recipe-json')

const PORT = process.env.PORT || 8000

app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'), () => console.log(`Server responding...`))
})

app.get('/api/recipes/:recipeName', (req, res) => {
    const recipeName = req.params.recipeName.toLowerCase()
    res.json(recipes)
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))