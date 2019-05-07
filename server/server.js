const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {User} = require('./models/user');
const cookieParser = require('cookie-parser');
const {auth} = require('./Middleware/auth');

const port = process.env.port || 3000;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth', {useNewUrlParser: true});

app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.post('/api/user', (req, res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password 
    });
    
    user.save((err, doc)=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(doc);
    })
});

app.post('/api/user/login', (req, res)=>{
    User.findOne({'email': req.body.email}, (err, user)=>{
        if (!user) {
            res.json({message: 'Auth failed, user not found'});
        } 
        else {
            user.comparePassword(req.body.password, (err, isMatch)=>{
                if (err) throw err;
                if (!isMatch) return res.status(400).send({
                    message: 'wrong password'
                });
                //res.status(200).send(isMatch);
            });

            //user logged in successfully --> start generate token 
            user.genToken((err, user)=>{
                if (err) return res.status(400).send(err);
                res.cookie('auth', user.token).send('ok');
            })

        }
    })    
});

app.get('/api/user/profile', auth, (req, res)=>{
    res.status(200).send(req.token);
});



app.listen(port, ()=>{
    console.log(`Started at port ${port}`);
});

