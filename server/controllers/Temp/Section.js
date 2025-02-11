
const Section = require( "../models/Section" );
const SubSection = require( "../models/SubSection" );
const Course = require( "../models/Course" );

/*
exports.createSection = async( req, res ) => {

    try {
            
        // S1: Fetching the data
        const {sectionName, courseId } = req.body;
        // S2: Data Validation
        if( !sectionName || !courseId ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Missing Properties",
            });
        } 
        // S3: Creating the Section Object.
        const newSection = await Section.create( {sectionName} );

        // S4: Updating the Course object with the newly created section.
        const updatedCourseDetails = await Course.findByIdAndUpdate( 
                                            courseId,
                                            {
                                                $push: {
                                                    courseContent: newSection._id,
                                                }
                                            },
                                            {new: true},
                                        );       
        // HW: Use Populate to replace the section IDs and Subsection IDs both in the updatedCourseDetails.
        // S5: Returning the response 
        return res.status( 200 ).json( {
            success: true,
            message: "Section created successfully!",
        });
    }
    catch( error ) {
        return res.status( 500 ).json( {
            success: false,
            message: "Section creating unsuccessful!, please try again!",
            error: error.message,
        });
    }
}
*/

exports.createSection = async (req, res) => {
    
    try {
      // Extract the required properties from the request body
      const { sectionName, courseId } = req.body
  
      // Validate the input
      if (!sectionName || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Missing required properties",
        })
      }
  
      // Create a new section with the given name
      const newSection = await Section.create({ sectionName })
  
      // Add the new section to the course's content array
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true }
      )
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      // Return the updated course object in the response
      res.status(200).json({
        success: true,
        message: "Section created successfully",
        updatedCourse,
      })
    } catch (error) {
      // Handle errors
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

// Handler Function to update the section.
exports.updateSection = async( req, res ) => {
    
    try {
        const { sectionName, sectionId, courseId } = req.body;

        const section = await Section.findByIdAndUpdate(
                                                        sectionId,
                                                        { sectionName },
                                                        { new: true }
                                                    );
        console.log( section );
                                          
        // Before, when we were just concerned with postman, the response without the data was absolutely fine. But now when we are trying to link the frontend with the backend, this has to LINK.

        const course = await Course.findById(courseId)
                                                    .populate({
                                                        path: "courseContent",
                                                        populate: {
                                                                    path: "subSection",
                                                                  },
                                                    }).exec();

        console.log(course);

        res.status(200).json({
            success: true,
            message: section,
            data: course,
        })
        } 
        catch (error) {
            console.error("Error updating section:", error)
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            })
    }    
}

// Handler Function to delete a section.
exports.deleteSection = async( req, res ) => {

    try {

        // Get the section ID - Assuming that we are sending the section ID in params.
        const {sectionId} = req.params;

        // Use findByIdAndDelete

        // TODO [Testing] : Do we need to delete the reference from the course schema as well?
        await Section.findByIdAndDelete( sectionId );

        // Return the response.
        return res.status( 200 ).json( {
            success: true,
            message: "Section Deleted Successfully!",
        });
    }
    catch( error ) {
        return res.status( 500 ).json( {
            success: false,
            message: "Section deletion unsuccessful!, please try again!",
        });
    }
}

// Updated: Delete Section Handler Function
exports.deleteSection = async (req, res) => {
    try {

        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate( courseId,    
                                            {
                                            $pull: 
                                            {
                                                courseContent: sectionId,
                                            },
                                        });

        const section = await Section.findById(sectionId);

        console.log(sectionId, courseId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);

        // find the updated course and return it
        const course = await Course.findById(courseId).populate({
                                                                path: "courseContent",
                                                                populate: {
                                                                path: "subSection",
                                                                },
                                                            })
                                                            .exec()

        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course,
        });
    } 
    catch (error) {
        
        console.error("Error deleting section:", error);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
  