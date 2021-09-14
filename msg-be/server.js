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

const Message = mongoose.model('Message', {
  userName: String,
  msg: String
});

const User = mongoose.model('User', {
  name: String,
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
});

app.get('/api/message', async (req, res) => {
  const docs = await Message.find();
  if (!docs) return res.json({ error: "error getting messages" });
  res.json(docs);
})

app.post('/api/message', async (req, res) => {
  const message = new Message(req.body);
  message.save();

  let user = await User.findOne({ name: message.user});
  console.log(user);

  if(!user)  {
    user = new User({user: message.user});
  }
  user.messages.push(message);
  user.save();
  res.json(true);
})


  
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});