const Product = require('../models/Product');
const ExtraCategory = require('../models/ExtraCategory');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

exports.addProductPage = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false, status: true });
        res.render('product/addProduct', { categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { categoryId, subCategoryId, extraCategoryId, name, description, price } = req.body;
        const status = req.body.status === 'on';
        const image = req.file ? '/uploads/' + req.file.filename : '';

        await Product.create({ categoryId, subCategoryId, extraCategoryId, name, description, price, image, status });
        res.redirect('/product/view?success=Product+added+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/product/add?error=Failed+to+add+product%2C+please+try+again');
    }
};

exports.viewProduct = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false })
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId');
        res.render('product/viewProduct', { products, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/product/view?success=Product+moved+to+trash');
    } catch (err) {
        console.log(err);
        res.redirect('/product/view?error=Failed+to+delete+product');
    }
};

exports.editProductPage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find({ isDeleted: false, status: true });
        const subCategories = await SubCategory.find({ categoryId: product.categoryId, isDeleted: false, status: true });
        const extraCategories = await ExtraCategory.find({ subCategoryId: product.subCategoryId, isDeleted: false, status: true });
        res.render('product/editProduct', { product, categories, subCategories, extraCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { categoryId, subCategoryId, extraCategoryId, name, description, price } = req.body;
        const status = req.body.status === 'on';
        let updateData = { categoryId, subCategoryId, extraCategoryId, name, description, price, status };
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/product/view?success=Product+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/product/view?error=Failed+to+update+product');
    }
};

exports.viewTrashProduct = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: true }).populate('extraCategoryId');
        res.render('product/trashProduct', { products, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.restoreProduct = async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isDeleted: false });
        res.redirect('/product/trash?success=Product+restored');
    } catch (err) {
        console.log(err);
        res.redirect('/product/trash?error=Failed+to+restore+product');
    }
};

exports.permanentDeleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/product/trash?success=Product+permanently+deleted');
    } catch (err) {
        console.log(err);
        res.redirect('/product/trash?error=Failed+to+delete+product');
    }
};
