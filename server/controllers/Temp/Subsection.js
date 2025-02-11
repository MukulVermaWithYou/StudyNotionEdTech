
const Subsection = require( "../models/SubSection" );
const Section = require( "../models/Section" );
const { uploadImageToCloudinary } = require( "../utils/imageUploader" );

// Handler Function to create the SubSection
exports.createSubSection = async( req, res ) => {

    try{

        // S1: Fetch the data from the req body.
        const {sectionId, title, timeDuration, description } = req.body;

        // S2: Extract the video file.
        const video = req.files.videoFile;

        // S3: Perform the validations!
        if( !sectionId || !title || !timeDuration || !description || !video ) {
            return res.status( 400 ).json( {
                success: false,
                message: "All fields are required",
            });
        }

        // S4: Upload the video file to Cloudinary. 
        // Note that the imageUploader is accepting a file irrespective of its type, so we can use it.
        const uploadDetails = await uploadImageToCloudinary( video, process.env.FOLDER_NAME );

        // S5: Create a Sub-Section
        const subSectionDetails = await Subsection.create( {
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // S6: Update the corresponding section concerned with this sub-section.
        const updatedSection = await Section.findByIdAndUpdate( {_id: sectionId }, 
                                                                { $push: {
                                                                    subSection: subSectionDetails._id,

                                                                }},
                                                                { new: true },
        );

        // TODO HW: Log Updated Section here, after the addition of the populate query!

        // S7: Return the response.
        return res.status( 200 ).json( {
            success: true,
            message: "Sub Section Created Successfully!",
            updatedSection,
        });
    }
    catch( error ) {
        return res.status( 500 ).json( {
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

// HW: updateSubsection
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
  
        if (!subSection) {
            return res.status(404).json({
            success: false,
            message: "SubSection not found",
            })
        }
  
        if (title !== undefined) {
            subSection.title = title
        }
  
        if (description !== undefined) {
            subSection.description = description
        }

        if (req.files && req.files.video !== undefined) {
                const video = req.files.video
                const uploadDetails = await uploadImageToCloudinary(
                                                video,
                                                process.env.FOLDER_NAME
                                            )

                subSection.videoUrl = uploadDetails.secure_url
                subSection.timeDuration = `${uploadDetails.duration}`
        }
  
        await subSection.save()
  
        // To collaborate with the front-end, we need the updated data to reflect the changes, so make sure to fetch an updated copy and send.
        const updatedSection = await Section.findById(sectionId).populate(
                                                "subSection"
                                            )
  
        console.log("Updated Section", updatedSection)
  
        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });

    } 
    catch (error) {
        console.error(error);
        
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}

// HW: deleteSubsection
exports.deleteSubSection = async (req, res) => {
        try {
            const { subSectionId, sectionId } = req.body
            await Section.findByIdAndUpdate(
                                                { _id: sectionId },
                                                {
                                                    $pull: {
                                                        subSection: subSectionId,
                                                    },
                                                }
                                            )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
            return res.status(404).json({ 
                success: false, 
                message: "SubSection not found" 
            });
        }
    
        // To collaborate with the front-end, we need the updated data to reflect the changes, so make sure to fetch an updated copy and send.
        const updatedSection = await Section.findById(sectionId).populate(
                                                                    "subSection"
                                                                )
                                                            
        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection, // Before, when we were just concerned with postman, the response without the data was absolutely fine. But now when we are trying to link the frontend with the backend, this has to LINK.
        });

        } 
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while deleting the SubSection",
            });
        }
    }
  