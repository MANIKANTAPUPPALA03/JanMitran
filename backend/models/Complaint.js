const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

const complaintSchema = new mongoose.Schema(
    {
        complaintId: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        sector: { type: String, required: true, enum: ['garbage', 'electricity', 'water', 'roads', 'other'] },
        subject: { type: String, required: true },
        description: { type: String, required: true },
        photoUrl: { type: String, default: null },
        status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    },
    { timestamps: true }
);

// Atomic counter for complaint ID generation
complaintSchema.statics.getNextComplaintId = async function () {
    const counter = await Counter.findByIdAndUpdate(
        'complaintId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return `JM-${new Date().getFullYear()}${String(counter.seq).padStart(4, '0')}`;
};

module.exports = mongoose.model('Complaint', complaintSchema);
