const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const recipes = require('./recipe-json')
const MongoClient = require('mongodb').MongoClient
const ejs = require('ejs')
require('dotenv').config() 

const PORT = process.env.PORT || 8000

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'baseRecipes',
    recipeNameCollection;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
    recipeLinkCollection = db.collection('linkToRecipe')
})
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', async function (request, response) {
    const data = await recipeLinkCollection.find().toArray();
    console.log(data);
    response.render('index.ejs', { info: data })    
})


// post recipe name, author, and link
app.post('/addRecipe', async function (request, response) {
    try {
        let result = await recipeLinkCollection.insertOne({ recipeName: request.body.recipeName, recipeAuthor: request.body.recipeAuthor, link: request.body.link, likes: 0 })
        
        console.log('Recipe Added')
        response.redirect('/')
    } catch (error) {
        console.error(error);
    }
})

app.put('/addOneLike', (request, response) => {
    recipeLinkCollection.updateOne({recipeName: request.body.recipeName, recipeAuthor: request.body.recipeAuthor, link: request.body.link, likes: request.body.likes},{
        $set: {
            likes:request.body.likes + 1
        }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))
    
})

app.delete('/deleteRecipe', (request, response) => {
    recipeLinkCollection.deleteOne({recipeName: request.body.recipeName})
    .then(result => {
        console.log('Recipe Deleted')
        response.json('Recipe Deleted')
    })
    .catch(error => console.error(error))
    
})

//get all recipes json api
app.get('/api/recipes', (req, res) => {
    // const recipeName = req.params.recipeName.toLowerCase()
    res.json(recipes)
})

//get recipe by name json api
app.get('/api/recipes/:recipeName', (req, res) => {
    const recipeName = req.params.recipeName.toLowerCase()
    if (recipes[recipeName]){
        res.json(recipes[recipeName])
    } else {
        res.status(404).end('We don\'t have this recipe yet! Sorry!')
    }
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))