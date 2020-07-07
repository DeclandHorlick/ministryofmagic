const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const db = "mongodb://testuser:testpw@ds123136.mlab.com:23136/eventsdb";
// mongoose.Promise = global.Promise;

mongoose.connect(db, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
});

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

router.get('/events', (req,res) => {
  let events = [
    {
      "_id": "1",
      "name": "User 1",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "User 2",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "User 3",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "User 4",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "User 5",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "User 6",
      "description": "IELTS EXAM",
      "date": "2020-07-08T18:25:43.511Z"
    }
  ]
  res.json(events)
})

router.get('/special', verifyToken, (req, res) => {
  let specialEvents = [
    {
      "_id": "1",
      "name": "Alerts User1",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Alerts User2",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Alerts User3",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "Alerts User4",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Alerts User5",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Alerts User6",
      "description": "List of anomalies",
      "date": "2020-07-08T18:25:43.511Z"
    }
  ]
  res.json(specialEvents)
})

router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)
  user.save((err, registeredUser) => {
    if (err) {
      console.log(err)      
    } else {
      let payload = {subject: registeredUser._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
    }
  })
})

router.post('/login', (req, res) => {
  let userData = req.body
  User.findOne({email: userData.email}, (err, user) => {
    if (err) {
      console.log(err)    
    } else {
      if (!user) {
        res.status(401).send('Invalid Email')
      } else 
      if ( user.password !== userData.password) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = {subject: user._id}
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
      }
    }
  })
})

module.exports = router;