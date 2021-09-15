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
  user: String,
  msg: String
});

const User = mongoose.model('User', {
  name: String,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

app.post('/api/message', async (req, res) => {
  const message = new Message(req.body);
  message.save();
  let user = await User.findOne({ name: message.user });

  if (!user) {
      user = new User({ name: message.user });
  }
  user.messages.push(message);
  user.save();
  res.json('success');
  res.status(200).send();
})

app.get('/api/message', async (req, res) => {
  const docs = await Message.find();
  if (!docs) return res.json({ error: "error getting messages" });
  res.json(docs);
})

app.get('/api/message/:name', async (req, res) => {
  const name = req.params.name;
  const user = await User.aggregate([
    {$match: {name}},
    {
      $project: {
        messages: 1,
        name: 1,
        isGold: {
          $gte: [{$size: "$messages"}, 5]
        }
      }
    },
  ]);

  await User.populate(user, {path: 'messages'});
  res.json(user[0]);
})
  
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});