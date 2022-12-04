const Product = require("../models/product");
const product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const e = require("express");
const { sortBy } = require("lodash");
const category = require("../models/category");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "Product  not fond"
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }

        //Destructure the fields
        const {name,description,price,category,stock} = fields;
        // restrictions on field
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        let product = new Product(fields);

        //handel file heare
        if(file.photo){
            if(file.photo.size>3000000){
                return res.ststus(400).json({
                    error: "file size too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }
        //console.log(product);

        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in DB faild"
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req,res) => {
    //Not getting photos so as to make query lighter
    req.product.photo = undefined
    return res.json(req.product)
}

//Getting photos through middle ware
//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Faild to delete the product"
            })
        }
        res.json({
            message:"Deletion was Sucessfull",
            deletedProduct
        });
    });
};

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }

        //Updation code
        // .extend add fields as well as replace fields  
        let product = req.product;
        product = _.extend(product, fields)

        //handel file heare
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error: "file size too big"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }

        //save to DB
        product.save((err,product) => {
            if(err){
                return res.status(400).json({
                    error: "Updation of product faild"
                });
            }
            res.json(product);
        });
    });
    
};

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "NO product FOUND"
          });
        }
        res.json(products);
      });
  };

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,category) => {
        if(err){
            return status(400).json({
                error: "No category found"
            });
        }
        res.json(category);
    });
};

exports.updateStocks = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter:{_id: prod._id},
                update:{$inc : {stock: -prod.count , sold: +prod.count}}
            }
        };
    });
    //Bulk write operation
    Product.bulkWrite(myOperations,{},(err,products) => {
        if(err){
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        }
        next();
    });
};