const mysql = require("mysql");
const express = require("express");



const app = express();
app.use("/assets",express.static("assets"));
app.use(express.urlencoded({ extended: true }));


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if (results) {
            res.redirect("/welcome");
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html")
})

app.post("/signup", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    
  
    connection.query("SELECT * FROM loginuser WHERE user_name = ?", [username], function(error, results, fields){
      if (results.length > 0){
        res.redirect("/"); // username already exists
      } else {
        connection.query("INSERT INTO loginuser (user_name, user_pass) VALUES (?, ?)", [username, password], function(error, results, fields){
          if (error) throw error;
          res.redirect("/welcome"); // signup successful
        });
      }
    });
  }).get("/signup", function(req, res){
    res.sendFile(__dirname + "/signup.html");
  });
  
  


// set app port 
app.listen(3000,()=>{
    console.log("server started")
});