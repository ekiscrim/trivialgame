import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true},
    }, {timestamps: true});

categorySchema.pre('remove', async function(next) {
    try {
        const Question = mongoose.model('Question');
        await Question.deleteMany({ category: this._id });
        next();
    } catch (err) {
        next(err);
    }
    });

const Category = mongoose.model("Category", categorySchema);

export default Category;