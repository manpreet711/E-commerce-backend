const express = require("express");
const router =express.Router()

const {getUserById,getUser,updateUser,userPurchaseList } = require("../controllers/user")
const {isSignedIn,isAuthenticated,isAdmin } = require("../controllers/auth")

//Params
router.param("userId",getUserById);

//read route
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser);

//update route
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)

//
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)

module.exports = router;