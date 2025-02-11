const mongoose = require( "mongoose" );
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema( {
    email: {
        type: String, 
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60,
        // The document will be automatically deleted after 5 minutes of its creation time!
    }
});

// Function to send the mails.
async function sendVerificationEmail( email, otp ) {
    try {
        const mailResponse = await mailSender( email, " Verification Email from StudyNotion: Where Preparation meets Expectations", emailTemplate(otp) );
        console.log( "Verification Mail sent successfully! " + mailResponse.response );
    }
    catch( error ) {
        console.log( "Verification Mail Sending Error: " + error );
        throw error;
    }
}

OTPSchema.pre( "save", async function(next) {
    
    console.log("New document saved to database");

    // Only send an email when a new document is being created!
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
})

module.exports = mongoose.model( "OTP", OTPSchema );