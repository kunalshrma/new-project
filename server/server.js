const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname +  `/../public`))
app.use(bodyParser.json()); // different way to use body-parser from before
//========================================
//        DB setup
//========================================
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/book_db');

//  Grabing Models
const {Book} = require('./models/books');
const {Store} = require('./models/stores');

//======== POST REQ to ADD A STORE =============
app.post('/api/add/store',(req,res) =>{
    //data came in body of req we create an instance of model to vaidate and if ok then save 
  const store = new Store({
      name:req.body.name,
      address:req.body.address,
      phone:req.body.phone
  });
  store.save((err,doc) =>{
      if(err) req.status(400).send(err);
      res.status(200).send();
  });
})

//======== GET REQ ============
app.get('/api/stores',(req,res) =>{
// whenever we get a req we use our model and we have find() which 
//return every thing untill and unless we pass some arguments and it now return doc and err
  Store.find((err,doc) =>{
        if(err) res.status(400).send(err)
        res.send(doc)
    })
})
// get req to set data in editing books it search the id in model 
app.get('/api/books/:id', (req,res) =>{
  Book.findById(req.params.id, (err,doc) =>{
    if(err) res.status(400).send(err)
    res.send(doc)
  })

})
//=========PATCH REQ =============
app.patch('/api/add/books/:id',(req,res) =>{

    Book.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true},(err,doc)=>{
      if(err) res.status(400).send(err)
      res.send(doc)
    })
})
//==========DELETE REQ============
app.delete('/api/delete/books/:id',(req,res) =>{
    Book.findByIdAndRemove(req.params.id,(err,doc) =>{
      if(err) res.status(400).send(err)
      res.send(doc)
    });

})



//=========POST BOOK ADD ==========
app.post('/api/add/books',(req,res) =>{
  //data came in body of req we create an instance of model to vaidate and if ok then save 
const book = new Book({
    name:req.body.name,
    author:req.body.author,
    pages:req.body.pages,
    price:req.body.price,
    stores:req.body.stores
});
book.save((err,doc) =>{
    if(err) req.status(400).send(err);
    res.status(200).send();
});
})
//=======get======
app.get('/api/books',(req,res) =>{

  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let order = req.query.ord ? req.query.ord : 'asc'; // desc

    Book.find().sort({_id:order}).limit(limit).exec((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    })


  // Book.find((err,doc) =>{
  //   if(err) res.status(400).send(err);
  //   res.send(doc)
  // })

})



//===================================
//        Port Setup
//===================================
const hostname = "127.0.0.1";
const port = process.env.port || 3000; //dynamic port for your local server as well as global server like heroku
app.listen(port, () => {
    console.log(`Your server is running at http://${hostname}:${port}`);
  });

//npm install express-handlebars
// npm install handle-bars 
//http://127.0.0.1:3000/enterjson