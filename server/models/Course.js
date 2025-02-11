const mongoose = require( "mongoose" );

const courseSchema = new mongoose.Schema( {

    courseName: {
        type: String,
    },
    courseDescription: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },  
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ratingAndReview"
        }
    ],

    price: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: [String],
        ref: "Tag",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",    
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    instructions: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
    },
});

module.exports = mongoose.model( "Course", courseSchema );