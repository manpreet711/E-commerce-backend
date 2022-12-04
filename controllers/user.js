const User = require("../models/user");
const user = require("../models/user");
const order = require("../models/order");


exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req,res) => {
    //undefined coz not to store/show into users profile
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile)
};

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id:req.profile._id },
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,user) => {
            if(err){
                return res.status(400).json({
                    error:"you are not authorised to update"
                })
            }
            req.salt = undefined;
            req.encry_password = undefined;
            res.json(user)
        }
    )
};

exports.userPurchaseList = (req,res) => {
    order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "no order in this account"
            })
        }
        return res.json(order)
    })
}

//Getting cart info from frontend
//and storing it into purchase array
exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = []
    req.body.order.product.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        });
    });

    //Store purchase array in DB ie.(updating)
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases:purchases}},
        {new: true},
        
        (err,purchases) => {
            if(err){
                return res.status(400).json({
                    error: "unabale to save purchase list"
                })
            }
            next();
        }
    )
}