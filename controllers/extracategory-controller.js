const ExtraCategory = require('../models/ExtraCategory');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');

exports.addExtraCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false, status: true });
        res.render('extracategory/addExtraCategory', { categories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.addExtraCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId, name, description } = req.body;
        const status = req.body.status === 'on';
        const image = req.file ? '/uploads/' + req.file.filename : '';

        await ExtraCategory.create({ categoryId, subCategoryId, name, description, image, status });
        res.redirect('/extracategory/view?success=Extra+category+added+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/extracategory/add?error=Failed+to+add+extra+category%2C+please+try+again');
    }
};

exports.viewExtraCategory = async (req, res) => {
    try {
        const extraCategories = await ExtraCategory.find({ isDeleted: false }).populate('categoryId').populate('subCategoryId');
        res.render('extracategory/viewExtraCategory', { extraCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.deleteExtraCategory = async (req, res) => {
    try {
        await ExtraCategory.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.redirect('/extracategory/view?success=Extra+category+moved+to+trash');
    } catch (err) {
        console.log(err);
        res.redirect('/extracategory/view?error=Failed+to+delete+extra+category');
    }
};

exports.editExtraCategoryPage = async (req, res) => {
    try {
        const extraCategory = await ExtraCategory.findById(req.params.id);
        const categories = await Category.find({ isDeleted: false, status: true });
        const subCategories = await SubCategory.find({ categoryId: extraCategory.categoryId, isDeleted: false, status: true });
        res.render('extracategory/editExtraCategory', { extraCategory, categories, subCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateExtraCategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId, name, description } = req.body;
        const status = req.body.status === 'on';
        let updateData = { categoryId, subCategoryId, name, description, status };
        if (req.file) {
            updateData.image = '/uploads/' + req.file.filename;
        }
        await ExtraCategory.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/extracategory/view?success=Extra+category+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/extracategory/view?error=Failed+to+update+extra+category');
    }
};

exports.viewTrashExtraCategory = async (req, res) => {
    try {
        const extraCategories = await ExtraCategory.find({ isDeleted: true }).populate('subCategoryId');
        res.render('extracategory/trashExtraCategory', { extraCategories, user: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.restoreExtraCategory = async (req, res) => {
    try {
        await ExtraCategory.findByIdAndUpdate(req.params.id, { isDeleted: false });
        res.redirect('/extracategory/trash?success=Extra+category+restored');
    } catch (err) {
        console.log(err);
        res.redirect('/extracategory/trash?error=Failed+to+restore+extra+category');
    }
};

exports.permanentDeleteExtraCategory = async (req, res) => {
    try {
        await ExtraCategory.findByIdAndDelete(req.params.id);
        res.redirect('/extracategory/trash?success=Extra+category+permanently+deleted');
    } catch (err) {
        console.log(err);
        res.redirect('/extracategory/trash?error=Failed+to+delete+extra+category');
    }
};

// AJAX route
exports.getExtraCategoriesBySubCategory = async (req, res) => {
    try {
        const extraCategories = await ExtraCategory.find({ subCategoryId: req.params.subCategoryId, isDeleted: false, status: true });
        res.json(extraCategories);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
