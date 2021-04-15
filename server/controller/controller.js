var Tododb = require('../model/model');

// create and save new Todo
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new Todo
    const todo = new Tododb({
        name : req.body.name,
        description : req.body.description,
        date: req.body.date,
        status : req.body.status
    })

    // save todo in the database
    todo
        .save(todo)
        .then(data => {
            //res.send(data)
            res.redirect('/add-todo');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

// retrieve and return all todo/ retrive and return a single todo
exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Tododb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found todo with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving todo with id " + id})
            })

    }else{
        Tododb.find()
            .then(todo => {
                res.send(todo)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving todo information" })
            })
    }

    
}

// Update a new idetified todo by todo id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Tododb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update todo with ${id}. Maybe todo not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update todo information"})
        })
}

// Delete a todo with specified todo id in the request
exports.delete = (req, res)=>{
    const id = req.params.id;

    Tododb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Todo was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Todo with id=" + id
            });
        });
}