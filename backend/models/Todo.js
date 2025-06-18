const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
    tags: [String],
    assignedUsers: [String],
    notes: [noteSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);
