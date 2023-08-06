const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require('express-session');

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

function getPhilippineStandardTime() {
    const localDate = new Date();
  
    const offsetInMinutes = 480; // GMT+8 offset in minutes
    const philippineDate = new Date(localDate.getTime() + offsetInMinutes * 60 * 1000);
  
    const year = philippineDate.getFullYear();
    const month = String(philippineDate.getMonth() + 1).padStart(2, '0');
    const day = String(philippineDate.getDate()).padStart(2, '0');
    const hours = String(philippineDate.getHours()).padStart(2, '0');
    const minutes = String(philippineDate.getMinutes()).padStart(2, '0');
    const seconds = String(philippineDate.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//CONNECT TO DATABASE
app.listen(3000, () =>{
    console.log('Hello! Listening at http://localhost:3000')
})

mongoose.connect('mongodb://127.0.0.1:27017/labdb')
    .then(() => console.log('Successfully Connected to Database.'))

//IMPORT MODELS & COLLECTIONS
const User = require('./models/User')
const Reservation = require('./models/Reservation')

//POPULATE DB WITH SAMPLE DATA
var users_sample_json = require(__dirname + '/models/sample_data/labdb.users.json')
User.insertMany(users_sample_json)

app.use(session({
    secret: 'walter',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
        maxAge: 3 * 7 * 24 * 60 * 60 * 1000  }, 
  }));


var searchUser = "";

// SEND PAGES
// resgistration page
app.get('/', async (req, res) =>{
    const user = req.session.user;

    if(user &&  req.session.rememberMe) {
        console.log("Ongoing Session...")
        currentUser = await User.findOne({email: user});
        if (currentUser.role === 'student') {
            res.redirect('/reservation-student');
        } else if (currentUser.role === 'technician') {
            res.redirect('/reservation-technician');
        }
    }
    else if (user &&  !req.session.rememberMe) {
        req.session.destroy(); // Destroy the session
        res.redirect('/');
        console.log("Logged out.");
    }
    else{
        res.sendFile(__dirname + "/public/register.html");
    }
});


// user profile page
app.get('/profile', async (req, res) => {
    const user = req.session.user;
    if (user) {
        // User is logged in, proceed with rendering the profile page
        res.sendFile(__dirname + "/public/profile.html");
    } else {
        // User is not logged in, redirect to login page
        res.redirect('/');
    }
});
// another user's profile page
app.get('/profile/search', async (req, res) => {
    const user = req.session.user;
    if (user) {
        // User is logged in, proceed with rendering the profile search page
        const searchUser = req.query.searchUser;
        req.session.searchUser = searchUser; // Store the search user in the session
        console.log("Searching for " + searchUser + " profile.");
        res.sendFile(__dirname + "/public/profilesearch.html");
    } else {
        // User is not logged in, redirect to login page
        res.redirect('/');
    }
});

// reservations student view
app.get('/reservation-student', async (req, res) =>{
    if(!req.session.user) {
        console.log("No user logged in. Redirecting to registration page.")
        return res.redirect('/');
    }
    else {
        currentUser = await User.findOne({email: req.session.user});

        if (currentUser.role === 'student') {
            res.sendFile(__dirname + '/public/reservations.html');
        } else if (currentUser.role === 'technician') {
            res.redirect('/');
        }
    }
});

// reservations technician view
app.get('/reservation-technician', async (req, res) =>{
    if(!req.session.user) {
        console.log("No user logged in. Redirecting to registration page.")
        res.redirect('/')
    }
    else {
        currentUser = await User.findOne({email: req.session.user});

        if (currentUser.role === 'technician') {
            res.sendFile(__dirname + '/public/reservationsTechnician.html')
        } else if (currentUser.role === 'student') {
            res.redirect('/');
        }
    }
})


//
app.get('/get/role', async (req, res) =>{
    const user = await User.findOne({email: req.session.user})
   
    if(user.role == "technician") {
        res.json({role: 'technician'})
    }
    else {
        res.json({role: 'student'})
    }
   
})

//REGISTRATION
// get email
app.get('/email', async (req, res) =>{
    var email = req.query.email
    const data = await User.find({email: email})
    
    if (data.length > 0) {
        res.sendStatus(200)
    }
    else {
        res.sendStatus(204)
    }
})

// get technician account
app.get('/email/technician', async (req, res) =>{
    var email = req.query.email
    const data = await User.find({role: "technician"})
    res.json(data)
})

// register student account
app.post('/register/student', async (req, res) =>{
    let newStudent = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        description: "",
        role: "student",
        isPublic: true
    });
    newStudent.save()
    console.log("Successfully Registered Student!")
    res.redirect('/')
})

// register technician account
app.post('/register/technician', async (req, res) =>{
    let newTechnician = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        description: "",
        role: "technician",
        isPublic: true
    });
    newTechnician.save()
    console.log("Successfully Registered Technician!")
    res.redirect('/')
})

// LOGIN & LOGOUT
// login account
// LOGIN & LOGOUT
app.get('/login', async (req, res) => {
    var email = req.query.email;
    var password = req.query.password;
    var rememberMe = req.query.rememberMe;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            const isPasswordCorrect = await user.comparePassword(password);

            if (isPasswordCorrect) {
                if (rememberMe == 1) {
                    req.session.user = user.email;
                    req.session.rememberMe = true;
                    req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // 3 weeks
                }
                else{
                    req.session.user = user.email;
                    req.session.rememberMe = false;
                    req.session.cookie.expires = false; 
                }

                
                res.json({ status: "success", role: user.role });
                console.log("Login Success!");
                console.log("remembered: " + req.session.rememberMe)
            } else {
                res.json({ status: "fail", role: "" });
                console.log("Login Failed.");
            }
        } else {
            res.json({ status: "fail", role: "" });
            console.log("Login Failed.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

// get current user
app.get('/get/currentuser', async (req, res) => {
    console.log("Current User: " + req.session.user);
    res.send(req.session.user || '');
});


// get search user
app.get('/get/searchuser', async (req, res) => {
    const searchUser = req.session.searchUser || ''; // Retrieve the searchUser from the session
    console.log("search user: " + searchUser);
    res.send(searchUser);
    req.session.searchUser = ''; // Clear the searchUser in the session
});

// logout account
app.get('/signout', async (req, res) => {
    req.session.destroy(); // Destroy the session
    res.redirect('/');
    console.log("Logged out.");
   
});


// RESERVATIONS
// get reservations
app.get('/get/reservations', async (req, res) => {
    var lab = req.query.lab
    var date = req.query.date
    const data = await Reservation.find({lab: String(lab), date: String(date)})
    res.json(data)
})

app.get('/get/reservations/all', async (req, res) => {

    const data = await Reservation.find({})
    res.json(data)
})

//
app.delete('/delete/reservation', async (req, res) => {
    var lab = req.query.lab
    var date = req.query.date
    var seat = req.query.seat
    var slots = [];

    req.query.slots.split(",").forEach(element => {
        slots.push(element)
    })
    const deletedReservation = await Reservation.deleteOne({lab: String(lab), date: String(date), seat: String(seat), slots: slots})
    console.log("Successfully Deleted.")
})

//get user's reservations
app.get('/get/reservations/user', async (req, res) => {
    var user = req.query.user
    var dateToday = req.query.dateToday
    var date = new Date(Date(dateToday))
    date.setDate(date.getDate() - 1);

    const data = await Reservation.find({email: String(user), date: {$gte: date}})
    res.json(data)
})

// get all reservations
app.get('/get/reservations', async (req, res) => {
    var user = req.query.user
    var dateToday = req.query.dateToday
    var date = new Date(Date(dateToday))
    date.setDate(date.getDate() - 1);

    const data = await Reservation.find({date: {$gte: date}})
    res.json(data)
})

// get slot reserver
app.get('/get/reservations/reserver', async (req, res) => {
    var date = req.query.date
    var lab = req.query.lab
    var seat = req.query.seat
    var slot = req.query.slot

    const reservation = await Reservation.find({date: date, lab: lab, seat: seat, slots: slot})
    

    if(reservation[0].isAnonymous == true) {
        res.json({name: 'anonymous', email: ''})
    }
    else {
        const reserver = await User.find({email: reservation[0].email})

        if(reserver[0].role == "technician") {
            res.json({name: 'Walk-in Student', email: ''})
        }
        else {
            res.json(reserver[0])
        }
    }
    
})

// submit reservation
app.post('/submit/reservation', async (req, res) => {
    // get the date of the machine
    var dateToday = getPhilippineStandardTime();

    let newReservation = new Reservation({
        email: req.body.email,
        date: req.body.date,
        requested: dateToday,
        lab: req.body.lab,
        seat: req.body.seat,
        isAnonymous: req.body.isAnonymous
    });

    req.body.slots.split(",").forEach(element => {
        newReservation.slots.push(element)
    })

    newReservation.save()
    res.send("Successfully Reserved!")
    console.log("Successfully Reserved!")
})

// edit reservation
app.patch('/update/reservation', async (req, res) => {
    var oldDate = req.query.oldDate
    var oldLab = req.query.oldLab
    var oldSeat = req.query.oldSeat
    var oldSlots = req.query.oldSlots.split(",")

    var newDate = req.query.newDate
    var newLab = req.query.newLab
    var newSeat = req.query.newSeat
    var newSlots = req.query.newSlots.split(",")

    const update = await Reservation.findOneAndUpdate({date: oldDate, lab: oldLab, seat: oldSeat, slots: oldSlots}, {date: newDate, lab: newLab, seat: newSeat, slots: newSlots}, {new: true}).exec();
    console.log("Successfully Updated.")

    res.json(update)
})

// USER ACCOUNT
// upload image
const upload = multer({
    dest: "public/images"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });

app.post(
"/submit/profilepicture",
upload.single("file" /* name attribute of <file> element in your form */),
(req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "public/images/" + req.session.user + ".jpg");

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
    fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res.redirect('/profile')
    });
    } else {
    fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
        .status(403)
        .contentType("text/plain")
        .end("Only .jpg files are allowed!");
    });
    }
}
)

// update profile details
app.patch('/update/user/profile', async (req, res) => {
    var email = req.body.email
    var name = req.body.name
    var description = req.body.description

    const update = await User.updateOne({email: email}, {$set: {name: name, description: description}}).exec();
    
    res.json(update)
})

// delete account
app.delete('/delete/user', async (req, res) => {
    var email = req.query.user

    const deletedUser = await User.deleteOne({email: email});
    const deletedReservations = await Reservation.deleteMany({email: email});
    
    res.redirect("/")
    console.log("Successfully Deleted Account.")
})



// SEARCH
// search users
app.get('/users', async (req, res) => {
    var input = req.query.name

    if(input != "") {
        const data = await User.find({
                                        "$or": [
                                        {
                                            "email": {
                                            "$regex": String(input),
                                            "$options": "i"
                                            },
                                            
                                        },
                                        {
                                            "name": {
                                            "$regex": String(input),
                                            "$options": "i"
                                            }
                                        }
                                        ]
                                    })
        res.json(data)
    }
    
})

// get another user's profile details
app.get('/get/user/profile', async (req, res) => {
    var email = req.query.email

    console.log("Profile of " + email)
    const data = await User.find({email: email})

    res.json(data)
})


// search if slot is reserved
app.get('/slot/isTaken', async (req, res) => {
    var lab = req.query.lab
    var seat = req.query.seat.split(",")
    var date = req.query.date
    var time = req.query.time.replace(":", "")

    var freeSeats = []

    for(var i = 0; i < 8; i++) {

        const data = await Reservation.find({lab: lab, seat: String(seat[i]), date: date, slots: String(time)})
        
        if(data.length == 0) {
            freeSeats.push(seat[i])
        }
    }
    
    res.json(freeSeats)
})