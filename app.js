//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:4000',
  clientID: 'NIlNyWPHdZcCth4z4DEGzByBwe0EGxt7',
  issuerBaseURL: 'https://dev-hri34pn2.us.auth0.com'
};


// auth router attaches /login, /logout, and /callback routes to the baseURL



const app = express();
app.use(auth(config));

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect("mongodb+srv://arshroop:Asdfjkl123@understated.oj6ulq1.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: false});
mongoose.set("useCreateIndex", true);

const userSchema = {
  secret: String
};

const User = new mongoose.model("User", userSchema);

app.get('/',function(req,res){
  if (req.oidc.isAuthenticated()) {
  res.render("home")
}else {
  res.redirect('/login')
}
})
app.get("/secrets", function(req, res){
 
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });

});

app.get("/submit", function(req, res){
    res.render("submit");

});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

  const user= new User({
    secret: submittedSecret
  })

  user.save(function(err,result){
    if(err){
      console.log(err);
    }else{
      console.log(result);
    }
  })

  res.redirect('/secrets')
})
//Once the user is authenticated and their session gets saved, their user details are saved to req.user.


app.listen(4000, function() {
  console.log("Server started on port 4000.");
});
