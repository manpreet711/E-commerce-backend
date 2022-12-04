const Category = require("../models/category");


exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,cate) => {
        if(err){
            return res.status(400).json({
                error: "category not found in DB"
            });
        }
        req.category = cate;
        next();
    });
};

exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err){
            return res.status(400).json({
                error: "Not able to save category into DB"
            });
        }
        res.json({category})
    });
};

exports.getCategory =(req,res) => {
    return res.json(req.category);
};

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,items) => {
        if(err){
            return res.status(400).json({
                error: "No Category found in DB"
            });
        }
        res.json(items)
    });
};

exports.updateCategory = (req,res) => {
    const category =req.category;
    category.name = req.body.name;

    category.save((err,updatedcategory) => { 
        if(err){
            return res.status(400).json({
                error: "Failed to update category"
            });
        }
        res.json({updatedcategory});
    });
};

exports.removeCategory = (req,res) => {
    const category = req.category;

    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete this category"
            });
        }
        res.json({
            mesaage:`${category.name} category was sucessfully deleted`
        });
    });
};