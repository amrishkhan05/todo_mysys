const express = require('express');
const route = express.Router()
const axios = require('axios');

const services = require('../services/render');
const controller = require('../controller/controller');
const bcrypt = require("bcrypt");
const User = require("../model/User");
const authenticateUser = require("../../middlewares/authenticateUser");

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description add todo
 *  @method GET /add-todo
 */
route.get('/add-todo', services.add_todo)

/**
 *  @description for update todo
 *  @method GET /update-todo
 */
route.get('/update-todo', services.update_todo)


// API
route.post('/api/todo', controller.create);
route.get('/api/todo', controller.find);
route.put('/api/todo/:id', controller.update);
route.delete('/api/todo/:id', controller.delete);

route
  .get("/", (req, res) => {
    res.render("index");
  })
  .get("/login", (req, res) => {
    res.render("login");
  })
  .get("/register", (req, res) => {
    res.render("register");
  })

  .get("/home", authenticateUser, (req, res) => {
    res.render("home", { user: req.session.user });
  });

// route for handling post requirests
route.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      res.send("invalid username or password");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("invalid useranme or password");
      return;
    }

    // else he\s logged in
    req.session.user = {
      email,
    };
    axios.get('http://localhost:3000/api/todo')
    .then(function(response){
        res.render('home', { todo : response.data });
    })
    .catch(err =>{
        res.send(err);
    })
  })
  .post("/register", async (req, res) => {
    const{ email, password, username, dob, address, phonenumber } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword, username, dob, address, phonenumber });

    latestUser
      .save()
      .then(() => {
        res.send("registered account!");
        return;
      })
      .catch((err) => console.log(err));
  });

//logout
route.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});
module.exports = route