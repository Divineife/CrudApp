const express = require('express');
const app = express();
const port = process.env.PORT;

// const nodemon = require('nodemon');

//mongoose setup
const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/CrudAppDb';

app.use(express.json());

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
    if (err){
        console.log(err);
    }else {
        console.log("Database connection successful");
    }
});

const profileSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String
})

const Profile = mongoose.model('Profile', profileSchema);

//creates new user profile via a post request 
app.post('/profiles', function(req, res) {
    Profile.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newProfile) =>{
        if (err){
            return res.status(500).json({message: err})
        }else{ 
            return res.status(200).json({message:"Your profile has successfully been created thank you :)" })
        }
    })
});

//get users profile via a get request
app.get('/profile/:id', (req, res) =>{
    
    Profile.findById(req.params.id, (err, profile) => {
        if (err) {
            return res.status(500).json({message: err })
        } else if (!profile) {
            return res.status(404).json({message: "User profile does not exist"})
        } else{
            return res.status(200).json({message: "User Profile has been fetched", data: profile})
        }
    })
    res.send('<h1>Looks good</h1>');
})

//to update a profile. I assumed that the user email cannot be changed
app.put('/profiles/:id', (req, res) =>{
    Profile.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        country: req.body.country
    }), (err, profile) => {
        if (err) {
            return res.status(500). json({message: err})
        }else {
            return res.status(200).json({message: "Profile successfully updated"})
        }
    }
})

//delete request
app.delete('/profiles/:id', (req, res) =>{
    Profile.findByIdAndDelete(req.params.id, (err, profile) => {
        if (err){
            return res.status(500).json({ message: err})
        } else if(!profile){
            return res.status(404).json({ message: "Profile not found"})
        }else {
            return res.status(200).json({message: "Profile successfully deleted"})
        }
    })
})

app.listen(5000, () => console.log('app listening on port 5000'));

