const express = require("express");
const router = express.Router();

const {getOrderById,createOrder,getAllOrders,getOrderStatus,updateStatus} = require("../controllers/order");
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user");
const {updateStocks} = require("../controllers/product");

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//ActualRoutes
//Create Route
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStocks,createOrder);

//Read Route
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);

//Status of order
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);


module.exports = router;