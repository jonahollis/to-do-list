// Server-side JS

// instantiating express variable, assigning it to express library
const express = require('express')

// requiring app to use express
const app = express()

// instantiate mongoclient variable, assign it to require mongodb
const MongoClient = require('mongodb').MongoClient

// instantiate port variable, assign it to 2121
const PORT = 2121

// requiring env file
require('dotenv').config()

// define db variable > point to mongodb string in env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
        // listens to port assigned in env file or port variable 
        app.listen(process.env.PORT || PORT, ()=>{
        console.log(`Server running on port ${PORT}`)
})
    })

// setting the view component of mvc to render ejs
app.set('view engine', 'ejs')

// pointing express to access files in public folder
app.use(express.static('public'))

// **express middleware parser functions that let you parse outgoing request data depending on the encoding of data you're sending to the server
app.use(express.urlencoded({ extended: true }))

// parses incoming JSON requests and puts the parsed data in request body 
app.use(express.json())

// listens for the get request at the root '/' path asynchronously
app.get('/', async (request, response)=>{
    // instantiates toDoItems variable, assigns it to await on the server to return the todos document items into a JSON array
    const todoItems = await db.collection('todos').find().toArray()
    // instantiates itemsLeft variable, assigns it to include todos document items with a attribute of completed set to false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // rendering ejs with items retrieved and responding with HTML
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

// listens for the post request at the '/addToDo' path, takes in request and response parameters
app.post('/addTodo', (request, response) => {
    // inserting new item into db of todos collection with a name sourced from input form, including key of completed with a value set to false
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // consoles logs that the to do list item is added
        console.log('Todo Added')
        // refresh the page at the root path
        response.redirect('/')
    })
    // logs an error otherwise
    .catch(error => console.error(error))
})

// listens for the put request at the '/markComplete' path, takes in request and response parameters
app.put('/markComplete', (request, response) => {
    // accesses todos collection of db and updates one using mongodb method that matches itemFromJS value sent in request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // sets completed attribute to true
            completed: true
          }
    },{
        // **sorts in some way
        sort: {_id: -1},
        // will not create item if can't be found in db
        upsert: false
    })
    .then(result => {
        // console log marked complete
        console.log('Marked Complete')
        // responds with json object of marked complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// listens for the put request at the '/markUncomplete' path, takes in request and response parameters
app.put('/markUnComplete', (request, response) => {
    // accesses todos collection of db and updates one using mongodb method that matches itemFromJS value sent in request body
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            // sets completed attribute to false
            completed: false
          }
    },{
        // sorts
        sort: {_id: -1},
        // will not create item if can't be found in db
        upsert: false
    })
    .then(result => {
        // console log marked complete
        console.log('Marked Complete')
        // responds with json object of marked complete
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// listens for the delete request at the '/deleteItem' path, takes in request and response parameters
app.delete('/deleteItem', (request, response) => {
    // accesses todos collection of db and deletes one item using mongodb method that matches itemFromJS value sent in request body
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // console logs 'todo deleted'
        console.log('Todo Deleted')
        // responds with json object of marked complete
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

// // listens to port assigned in env file or port variable 
// app.listen(process.env.PORT || PORT, ()=>{
//     console.log(`Server running on port ${PORT}`)
// })