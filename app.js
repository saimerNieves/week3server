//ROUTER


const express = require('express') //importing express from express
const expressHandleBars = require('express-handlebars') //import express from expressHandlebars

const app = express()


const mongoose = require('mongoose') // importing mongoose

const bodyparser = require('body-parser')

const path = require("path")


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(__dirname+"/views")) //any files here we will have access to

//connection to databse LOCALLY
mongoose.connect("mongodb://localhost:27017/Empl", { //this creates the dabase name
    useNewURLParser:true //makes the connection to the database

}).then(()=>{

    console.log("Congratulations we have connected to the Database !")
}).catch((err) =>{

    console.log(err)
});

//path to database model Javascript file
require("./models/Employee")
//set our view engine
//Expres templates do it for you


let EmployeeCollection = mongoose.model("employeeSchema") //SCHEMA From Food.js


//Engine configurations*******************************
app.engine("hbs", expressHandleBars.engine({
    defaultLayout:"main",
    extname:".hbs",
    helpers:{ //helpers are functions we can use to help us
        getShortComment(comment){
            if(comment.length < 60){
                return comment;
            }
            else{
                return comment.substring(0, 60) + "...";
            }
        }
    }
})) //what engine we will be using

app.set("view engine", "hbs") //sets the engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'))
//2 parameters are route and callback function
app.get("/",(request,response)=>{ //route to render the page

    //render html page home
    response.render("home_Template")
})

//gets the data from database //reads it
app.get("/getData",(request, response)=>{

    EmployeeCollection.find().then((employeesFound)=>{

        response.json({employeesFound})

    })

})

app.get("/updateEmployee",(request,response)=>{ //route to render the page

    //render html page home
    response.render("updateEmployee")
})


//route for saving the data. to data base
app.post("/saveEmployee", (request, response)=>{

    console.log(request.body)//data on server //Names on the form input must match the database column names in Model/Food.js

    //create a new entry for the food on the database
    new EmployeeCollection(request.body).save().then(()=>{

        console.log("Data Saved!")

        //response.redirect("./employeeList.html")
        response.redirect("employeeList") //must render for HBS //You can pass down variables in here
    })

   // response.redirect(307,"./employeeList.html")
})

app.get("/employeeList",(request,response)=>{ //route to render the page

    //render html page home
    response.render("employeeList")
})



//Delete the data from the database
app.post("/deleteEmployee", (request, response)=>{

    console.log("Employee deleted " + request.body._id + " " + request.body.employeeFirstName + " " + request.body.employeeLastName)

    EmployeeCollection.findByIdAndDelete(request.body._id).exec() //deletes based on the ID

    
    response.redirect("employeeList")

})






//Update the data from the database
app.post("/updateEmployee", (request, response)=>{
    //   {"_id":{"$oid":"6201481a89b77b9716675054"},"employeeFirstName":"Michael","employeeLastName":"Jordan","__v":0}
   
    
   
       let searchQueryID = {_id: request.body._id}
       let updatedInfo = { 
           $set: {
               employeeFirstName: request.body.employeeFirstName,
               employeeLastName: request.body.employeeLastName,
               employeeDepartment: request.body.employeeDepartment,
               employeeStartDate: request.body.employeeStartDate,
               employeeJobTitle: request.body.employeeJobTitle,
               employeeSalary: request.body.employeeSalary
          
           } 
       };
   
       console.log("HERE" + request.body._id)
       console.log(updatedInfo)
   
       EmployeeCollection.updateOne(searchQueryID, updatedInfo, (err, res)=> {
   
         if (err) throw err;
   
         console.log("1 Employee updated");
   
       });
   
       response.redirect("employeeList")
   })
   


   

   const PORT = process.env.PORT || 3005

   //setup port for connection 
   app.listen(PORT, ()=>{
   
       console.log("Connected on port 3005")
   })
   
   
   



