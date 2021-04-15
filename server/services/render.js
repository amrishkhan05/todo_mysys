const axios = require('axios');


exports.homeRoutes = (req, res) => {
    // Make a get request to /api/todo
    axios.get('http://localhost:3000/api/todo')
        .then(function(response){
            res.render('index', { todo : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

    
}

exports.add_todo = (req, res) =>{
    res.render('add_todo');
}

exports.update_todo = (req, res) =>{
    axios.get('http://localhost:3000/api/todo', { params : { id : req.query.id }})
        .then(function(tododata){
            res.render("update_todo", { todo : tododata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}