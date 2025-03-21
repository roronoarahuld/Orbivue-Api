// Creating an express function
const express = require('express');
// Importing FS Module
const fs = require('fs');
// Importing express in app
const app = express();
// Adding a port where we can see your api running
const PORT = 8080;

// Adding Middleware which will ease the task of sending data and storing in our file
app.use(express.urlencoded({extended: false}))

// Importing Json file to Add, Delete, Update the file
const personalDetails = require("./personal-details.json");
const hobbiesDetails = require("./hobbies.json")

// Firing up the api where it will listen all the commands using listen function
app.listen(
    // Testing if the port is running properly on the listen function
    PORT, () => console.log("The port is running on", PORT)
)
// Using get method to show all the data
//inside get parenthesis we declare route
app.get("/personal-details", 
    // Below is the callback function we use when user hit the route
    // Request is for incoming data while response is for the data we want to send it to the user
    (req, res) =>{
        return res.json(personalDetails);
        // Sending a status response and then sending the data to the user. The data is an javascript object
        // res.status(200).send({
        //     Name : "Sanket Dalvi",
        //     Age : "30"
        // })

        // To show the json file 
    }
);

// Get data using Dynamic parameters
// get(/user/:id) :id indicates that the parameter is dynamic
app.get("/personal-details/:id", (req, res) =>{
    // Assigning the ID to a variable
    const getId = req.params.id;
    // Finding the id in the JSON file and attaching that Id in a Variable
    const details = personalDetails.find((userDetails)=>userDetails.id == getId)
    // Printing the final Value
    return res.json(details)
})


// Adding route
// Using Route we can add get,patch, delete function all at one place.
app.route("/hobbies/:id")
.get((req, res) => {
        const hobbiesid = req.params.id
        const hobbiesUser = hobbiesDetails.find((hobbiesList)=> hobbiesList.id == hobbiesid)
        console.log("what is the id", hobbiesUser)
        return res.json(hobbiesUser)
    }
)

// POST METHOD
app.post("/hobbies", (req,res)=>{
    // Whatever data is being sent from the frontend, Express put everything in the req.body
    const body = req.body
    console.log("body", body)
    // Pushing the body which means frontend data to the hobbiesdetails which is the json file
    // Adding the Id dynamically whenever there is a new reocrd push
    hobbiesDetails.push({ 
        id: hobbiesDetails.length + 1, 
        hobbiesList : [{...body}]  // ... is spread operator
    })
    // using fs module to append all the data to the json
    fs.writeFile("./hobbies.json", JSON.stringify(hobbiesDetails), (err , data)=> {
        return res.json({status: "Success"}) 
    }) 
})

app.post("/personal-details",(req,res)=>{
    // Whatever data is being sent from the frontend, Express put everything in the req.body
    const body = req.body
    // Pushing the body which means frontend data to the hobbiesdetails which is the json file
    // Adding the Id dynamically whenever there is a new reocrd push
    personalDetails.push({
        ...body,
        id: personalDetails.length +1,
    })
    // using fs module to append all the data to the json
    fs.writeFile("./personal-details.json", JSON.stringify(personalDetails),(err, data)=>{
        return res.json({status: "Sucess"})
    })
})

// DELETE Method
app.delete("/personal-details/:id",(req,res)=>{
    const delId = req.params.id
    // Finding the index of the matching id = delID
    // Using findIndex method we can get the index of an array
    const personalDetailsDel = personalDetails.findIndex((delPersonal)=>delPersonal.id == delId)
    // Using splice method to remove the ID associated with delID
    personalDetails.splice(personalDetailsDel,1)
    // Updating the file
    fs.writeFile('./personal-details.json', JSON.stringify(personalDetails),(err, data)=>{
        return res.json({status: "Success"})
    })
})

// PATCH Method
app.patch("/hobbies/:id", (req, res)=>{
    const hobbId = req.params.id
    const body = req.body;
    const updateHobby = hobbiesDetails.findIndex((updateId)=>updateId.id == hobbId)
    // Refers to the existing hobby object at the given index.
    hobbiesDetails[updateHobby] = {
        // Uses the spread operator to create a copy of the existing object with all its properties.
        ...hobbiesDetails[updateHobby],
        // Uses the spread operator again to add or overwrite the properties with the new values from the request body.
        hobbiesList:[{...body}]
    }
    fs.writeFile('./hobbies.json', JSON.stringify(hobbiesDetails),(err, data)=>{
        return res.json({status: "Success"})
    })
})