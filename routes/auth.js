var express = require('express')
var router = express.Router()
const{check, validationResult} = require('express-validator')

const{signout,signup,signin,isSignedIn} = require("../controllers/auth")

//Signup Route
router.post("/signup",
[
    check("name").isLength({ min: 3 }).withMessage('Name must be at least 3 chars long'),
    check("email").isEmail().withMessage('Please enter correct email address'),
    check("password").isLength({ min: 3 }).withMessage('Password length should be minium 3 char long')
], 
signup);

//Signin Route
router.post("/signin",
[
    check("email").isEmail().withMessage('Please enter correct email address'),
    check("password").isLength({ min: 3 }).withMessage('Enter a valid password')
], 
signin);

//Signout Route
router.get("/signout", signout );


router.get("/testroute",isSignedIn,(req,res) => {
    res.send("A Protected Route");
});

module.exports = router;