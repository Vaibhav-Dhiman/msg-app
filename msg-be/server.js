var express = require('express');
var app = express(); 
const MongoClient = require('mongodb').MongoClient;
var cors = require('cors')
const mongoose = require('mongoose');
var PORT = 3000;
const url = 'mongodb://localhost:27017/msgapp';

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("database connected");
});

const MessageSchema = new mongoose.Schema({
  user: String,
  msg: String
});

const Message = mongoose.model('Message', MessageSchema);
  

const UserSchema = new mongoose.Schema({
  user: String
});

const User = mongoose.model('User', UserSchema);

app.get('/api/message', async (req, res) => {
  const docs = await Message.find();
  if (!docs) return res.json({ error: "error getting messages" });
  res.json(docs);
})

app.post('/api/message', async (req, res) => {
  const message = new Message(req.body);
  message.save();
  console.log(message);

  const foundUser = await User.findOne({ name: message.user});
  console.log(foundUser);

  if(!foundUser) (new User({name: message.user})).save();
  res.json('success');
})


  
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});