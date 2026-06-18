const Category = require('../models/Category');

exports.addCategoryPage = (req, res) => {
    res.render('category/addCategory', { user: req.user });
};

exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const status = req.body.status === 'on';

        await Category.create({ name, description, status });
        res.redirect('/category/view?success=Category+added+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/category/add?error=Failed+to+add+category%2C+please+try+again');
    }
};

exports.viewCategory = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.render('category/viewCategory', { categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/category/view?success=Category+moved+to+trash');
    } catch (err) {
        console.log(err);
        res.redirect('/category/view?error=Failed+to+delete+category');
    }
};

exports.editCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('category/editCategory', { category, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const status = req.body.status === 'on';
        const updateData = { name, description, status };

        await Category.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/category/view?success=Category+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/category/view?error=Failed+to+update+category');
    }
};

exports.viewTrashCategory = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: true });
        res.render('category/trashCategory', { categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.restoreCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, { isDeleted: false });
        res.redirect('/category/trash?success=Category+restored');
    } catch (err) {
        console.log(err);
        res.redirect('/category/trash?error=Failed+to+restore+category');
    }
};

exports.permanentDeleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/category/trash?success=Category+permanently+deleted');
    } catch (err) {
        console.log(err);
        res.redirect('/category/trash?error=Failed+to+delete+category');
    }
};
