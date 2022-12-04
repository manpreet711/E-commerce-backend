const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

//Product Cart Schema
const productCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price:Number,
})
const productCart = mongoose.model("ProductCart",productCartSchema)

//Order SChema
const OrderSchema = new mongoose.Schema({
    products: [productCartSchema],
    transaction_id:{},
    amount: {type:Number},
    address: String,
    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled","Delivered","Shipped","Processing","Recieved"]
    },
    updated: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
},{timestamps:true});
const Order = mongoose.model("Order",OrderSchema)

module.exports = {Order,productCart};