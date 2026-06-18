const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);
