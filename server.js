import express from "express"
import logger from 'morgan'

//create a PORT variable with an environment variable or 3000
const PORT = process.env.PORT || 3000

//create an app variable for using express
const app = express()

//This is where we configure morgan, in this instance we are configuring in 
//the development format. There is also production format as well, as 
//custom app.use is a middleware (add ons/plugins for Express). So Morgan 
//is an add on that we are configuring as a middleware 

//have express use logger with "dev" as the logger argument.
app.use(logger('dev'))

//The below line is needed because we are going to need access to the json
//of the HTTP post request since when making post request, we are including
//the body. This will allow us access to the json of the body when making 
//post requests

//have express use express.json
app.use(express.json())

//The below is in order to launch an express server
//The listen method accepts two arguments, one is the port number
//the other is a call back function. Once the server runs successfully 
//on this port number, the listen method will execute the second argument 
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))

//This method will listen for a GET request
//The first argument is a specific path
//The second argument is going to be the logic it will respond with
//in the form of a callback function. 
//This whole item is called an Express Route
//We always need a Request and Response in the callback function but only //one response

//Using res below, because res has a method called send, which will
//send plain text or html
app.get('/', (req, res) => {
  res.send('I am responding to your HTTP GET request on the / path')
})


//create dummy data that we will use to test the GET requests
const people = [
  {id: "1", name: "jeshaiah", age: 19, gender: "male"},
  {id: "2", name: "Chasya", age: 20, gender: "female"}
]

//Using res below, because res has a method called json, which will
//reply with json which then we can pass in an array of objects, and
//it is smart enough to convert it to json
app.get('/people', (req, res) => {
  res.json(people)
})

//using slugs in the backend to work with individual items. In this 
//case, we want to work with the name of the objects and only return
//the one object
app.get('/people/:name', (req, res) => {
  //we set up a new variable with the request, in this case the name
  //as the params. Since we put "name" after the slug, that is what we
  //put after the params below.
  //req.params is an object

  //let name = req.params.name
  //The below code is the same as the above, just simplified. 
  const { name } = req.params

  //We are iterating through the people array and looking for the first object
  //whose name matches the name in the request
  const names = people.find((person) => person.name === name)
  res.json(names)
})


//POST REQUESTS
app.post('/people', (req, res) => {
  //using req.body instead of req.params since we are working with POST request
  const person = req.body
  //we are pushing the new product into the array of the products
  people.push(person)
  res.json(people)
})

//PUT REQUESTS
app.put('/people/:id', (req, res) => {
  //grabbing the ID of the person the user wants to update
  const id = req.params.id
  //using that ID to find the person in our people array. Using findIndex
  //method so that when we find the matching ID, it will return the index of
  //that person
  const personIndex = people.findIndex(person => person.id === id)
  //The spread operator (...) pulls out the keys and values of each object.
  //It then combines and assigns the existing object (the person being edited)
  //to req.body as a new object. req.body is the changes being made to the
  //person. This causes the new updated object to have duplicate keys and
  //values. Example, if we are updating "age", the new object will have two
  //"age" keys and values. Javascript will actually take the latter of these
  //two items, which will be the updated one, and get rid of the original
  //"age". Now that we have a new object, with the updates, it assigns the
  //new object to the person varuable.
  const person = { ...people[personIndex], ...req.body }
  //here we are using splice to update our people array
  //we are saying. from the index of the person we are updating, delete 1
  //object and replace it with the person. This will replace our new person
  //and delete the old person.
  people.splice(personIndex, 1, person)
  res.json(person)
})


//DELETE REQUEST
app.delete('/people/:id', (req, res) => {
  //Need to specify the id of the product you wnat to delete
  const id = req.params.id
  //will now find the index of the product that matches the ID

  const personIndex = people.findIndex(person => person.id === id)
  //use splice without the third argument, which will only delete, not replace.

  people.splice(personIndex, 1)
  res.json(people)
})



