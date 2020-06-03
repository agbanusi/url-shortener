'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser= require('body-parser')
var cors = require('cors');
const urlExists=require('url-exists')

var app = express();

app.use(bodyParser.urlencoded({extended:false}))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true}); 
var Schema=mongoose.Schema;
var pSchema= new mongoose.Schema({number:Number,url:String})
var Url= mongoose.model('Url', pSchema);
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new',(req,res,done)=>{
  var numb=Math.floor(Math.random()*9).toString()+Math.floor(Math.random()*9).toString()+Math.floor(Math.random()*9).toString();
  var no=req.body.url;
  urlExists(no,(err,exists)=>{
    if (exists){
      var saver=new Url({number:numb,url:no})
      saver.save((err,doc)=>{
      if (err) throw err;
      done(null,doc)
      })
      res.send({"original_url":no,"short_url":numb})
    }
    else{
    res.send({error:"Invalid URL"})
    }
  })
  
})

app.get('/api/shorturl/:num?',(req,res,next)=>{
  var short=req.params.num
  Url.findOne({number:short},'url',(err,doc)=>{
    if (err) throw err
    res.redirect(doc.url)
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});