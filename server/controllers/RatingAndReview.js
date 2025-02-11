
const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

// Create a new rating and review
exports.createRating = async (req, res) => {
    try {

        const userId = req.user.id
        const { rating, review, courseId } = req.body

        // Check if the user is enrolled in the course!
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnroled: { $elemMatch: { $eq: userId } },
        })

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course",
            })
        }

        // Check if the user has already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        })

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course already reviewed by user",
            })
        }
        
        // Otherwise.. we are free to
        // Create a new rating and review
        const ratingReview = await RatingAndReview.create({
                                                            rating,
                                                            review,
                                                            course: courseId,
                                                            user: userId,
                                                        })

        // Adding the Rating and Review!
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
                                        {
                                            $push: {
                                                ratingAndReviews: ratingReview._id,
                                            },
                                        }, 
                                        {new : true} );
        // await courseDetails.save()
        console.log( updatedCourseDetails );

        return res.status(200).json({
            success: true,
            message: "Rating and review created successfully",
            ratingReview,
        })
    } 
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// Get the average rating for a course
exports.getAverageRating = async (req, res) => {
    
    try {
      
        const courseId = req.body.courseId
  
        // Calculate the average rating using the MongoDB aggregation pipeline
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId), // Convert courseId to ObjectId
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ])
  
        if (result.length > 0) {
            return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,
            })
        }
  
        // If no ratings are found, return 0 as the default rating
        return res.status(200).json({ success: true, averageRating: 0 })
    } 
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating for the course",
            error: error.message,
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        
        const { categoryId } = req.body;
  
        // Get courses for the specified category.

        const selectedCategory = await Category.findById(categoryId)
                                                .populate({
                                                    path: "courses",
                                                    match: { 
                                                            status: "Published"     
                                                    },
                                                    populate: "ratingAndReviews",
                                                    })
                                                .exec();
  
        console.log("SELECTED COURSE", selectedCategory);

        // Handle the case when the category is not found
        if (!selectedCategory) {
                console.log("Category not found.");
                return res.status(404).json({ 
                    success: false, 
                    message: "Category not found" 
                })
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {

            console.log("No courses found for the selected category.")

            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }
  
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
                                                                _id: { $ne: categoryId }, // Not Equal to operator
                                                            });

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
                                                    ).populate({
                                                        path: "courses",
                                                        match: { 
                                                            status: "Published" 
                                                        },
                                                    })
                                                    .exec();
      

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
                                                .populate({
                                                    path: "courses",
                                                    match: { 
                                                        status: "Published" 
                                                    },
                                                })
                                                .exec();

        const allCourses = allCategories.flatMap((category) => category.courses)

        const mostSellingCourses = allCourses
                                    .sort((a, b) => b.sold - a.sold)
                                    .slice(0, 10)
    
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
  }