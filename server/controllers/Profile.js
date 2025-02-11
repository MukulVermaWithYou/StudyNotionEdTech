
const Profile = require( "../models/Profile" );
const User = require( "../models/User" );

const { uploadImageToCloudinary } = require( "../utils/imageUploader" );

// Added as homework!
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
exports.instructorDashboard = async (req, res) => {
    try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnroled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price

        // Create a new object with the additional fields
        const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
        }

        return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
    } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
    }
}

exports.updateProfile = async( req, res ) => {

    try{

        // S1 - Extract the information.
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

        // S2 - Obtain the current User's ID
        const id = req.user.id;

        // S3 - Perform the validation
        if( !contactNumber || !gender || !id )  {
            return res.status( 400 ).json( {
                success: false,
                message: "All fields are required",
            });
        }

        // S4 - Find the profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById( profileId );

        // S5 - Update the Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        // BE SURE TO SAVE THE PRE-EXISTING Object, with the updated changes.
        await profileDetails.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
                                    .populate("additionalDetails")
                                    .exec();
        // S6 - Return the response.
        return res.status( 200 ).json( {
            success: true,
            message: "Profile Updated Successfully!",
            updatedUserDetails
        });
    }
    catch( error ) {
        return res.status( 500 ).json( {
            success: false,
            error: error.message,
        });
    }
}

// deleteAccount Handler Function
// Explore: Cron Jobs ~ How automated requests can be set-up, or a delayed task to be scheduled.

exports.deleteAccount = async( req, res ) => {

    try {

        // S1 - Obtain the user ID from the current Login session.

        const id = req.user.id;


        // S2 - Perform the data validation.
        const userDetails = await User.findById( id );

        if( !userDetails ) {
            return res.status(404).json( {
                success: false,
                message: "User not found",
            });
        }

        // S3 - Make sure to delete the profile first, before the User which contains profile to avoid leaving remnants
        await Profile.findByIdAndDelete( { _id: userDetails.additionalDetails });

        // TODO: Find how to reduce the count of enrolled students having this account being deleted.
        // S4 - Delete the User.
        await User.findByIdAndDelete( {_id: id} );

        // S5 - Return the response.
        return res.status( 200 ).json( {
            success: true,
            message: "User Deleted Successfully",
        });
    }
    catch( error ) {

        return res.status( 500 ).json( {
            success: false,
            message: "User couldn't be deleted successfully!",
        });
    }
}

// Let's try getAllUserDetails handler function
exports.getAllUserDetails = async( req, res ) => {

    try {

        // Get the user ID
        const id = req.user.id;

        // Get user details and perform the validation.
        const userDetails = await User.findById( id ).populate( "additionalDetails" ).exec();

        // Return the response.
        return res.status( 200 ).json( {
            success: true,
            message: "User Details Fetched Successfully!",
            userDetails,
        });
    }
    catch( error ) {
        return res.status( 500 ).json( {
            success: false,
            message: error.message,
        });
    }
}

// Handler Function to update the Profile Picture
exports.updateDisplayPicture = async (req, res) => {
    try {

        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        const imageInfo = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )

        console.log(imageInfo);

        const updatedProfile = await User.findByIdAndUpdate(
                                                            { _id: userId },
                                                            { image: imageInfo.secure_url },
                                                            { new: true }
                                                        );

        
        res.send({
            success: true,
            message: `Profile Image Updated successfully!`,
            data: updatedProfile,
        })
    } 
    catch( error ) {
        return res.status(500).json({
            success: false,
            message: "Oops, something went wrong!",
        })
    }
}
  