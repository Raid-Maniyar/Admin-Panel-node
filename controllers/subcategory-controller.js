const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

exports.addSubCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false });
        res.render('subcategory/addSubCategory', { categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.addSubCategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body;
        const status = req.body.status === 'on';
        const image = req.file ? '/uploads/' + req.file.filename : '';

        await SubCategory.create({ categoryId, name, description, image, status });
        res.redirect('/subcategory/view?success=Sub+category+added+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/subcategory/add?error=Failed+to+add+sub+category%2C+please+try+again');
    }
};

exports.viewSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ isDeleted: false }).populate('categoryId');
        res.render('subcategory/viewSubCategory', { subCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/subcategory/view?success=Sub+category+moved+to+trash');
    } catch (err) {
        console.log(err);
        res.redirect('/subcategory/view?error=Failed+to+delete+sub+category');
    }
};

exports.editSubCategoryPage = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        const categories = await Category.find({ isDeleted: false });
        res.render('subcategory/editSubCategory', { subCategory, categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const { categoryId, name, description } = req.body;
        const status = req.body.status === 'on';
        let updateData = { categoryId, name, description, status };
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        await SubCategory.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/subcategory/view?success=Sub+category+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/subcategory/view?error=Failed+to+update+sub+category');
    }
};

exports.viewTrashSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ isDeleted: true }).populate('categoryId');
        res.render('subcategory/trashSubCategory', { subCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.restoreSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.params.id, { isDeleted: false });
        res.redirect('/subcategory/trash?success=Sub+category+restored');
    } catch (err) {
        console.log(err);
        res.redirect('/subcategory/trash?error=Failed+to+restore+sub+category');
    }
};

exports.permanentDeleteSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.redirect('/subcategory/trash?success=Sub+category+permanently+deleted');
    } catch (err) {
        console.log(err);
        res.redirect('/subcategory/trash?error=Failed+to+delete+sub+category');
    }
};

exports.getSubCategoriesByCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ categoryId: req.params.categoryId, isDeleted: false, status: true });
        res.json(subCategories);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
