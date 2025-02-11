
const User = require( "../models/User" );
const mailSender = require( "../utils/mailSender" );
const bcrypt = require( "bcrypt" );
const crypto = require( "crypto" );


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {

    try {
        // S1: Get Email from the request body.
        const email = req.body.email;

        // S2: Check pre-existing user for this email ID, and email validation.
        const user = await User.findOne( {email: email} );
        if( !user ) {
            return res.json( {
                success: false,
                message: "The entered e-Mail ID is not registered with us!",
            });
        }

        // S3: Generate Token
        const token = crypto.randomBytes(20).toString("hex");

        // S4 - Update User by Adding Token And Expiration Time
        const updatedDetails = await User.findOneAndUpdate( 
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true});

        // S5: Create URL
        const url = `http://localhost:3000/update-password/${token}`

        // S6: Send the mail containing the reset link!
        await mailSender( email,
                        "Password Reset Link",
                        `Password Reset Link: ${url}`,
        );

        // Return the response
        return res.json( {
            success: true,
            message: "Email sent successfully, please check the mail and reset password.",
        });
    }
    catch( error ) {
        console.log( error );
        return res.status(500).json( {
            success:false,
            message: "Something went wrong while generating the reset password link",
        });
    }
}

// resetPassword

// Time to write the algorithm!
exports.resetPassword = async( req, res ) => {

    try {
        // S1: Fetch the Data
        const {password, confirmPassword, token } = req.body;
        // S2: Validate the Data
        if( password != confirmPassword ) {
            return res.json( {
                success: false,
                message: "Passwords do not match!",
            });
        }

        // S3: Get User Details using the Token!
        const userDetails = await User.findOne( {token: token} );
        // S4: If No Entry is found: Invalidate the token.

        if( !userDetails ) {
            return res.json( {
                success: false,
                message: "Token is invalid!",
            });
        }
        // S5: Token Time Check as well
        if( userDetails.resetPasswordExpires < Date.now() ) {
            return res.json( {
                success: false,
                message: "Token is expired, please regenerate the token!",
            });
        }

        // S6: Hash the password.
        const hashedPassword = await bcrypt.hash( password, 10 );
        // S7: Password Update
        await User.findOneAndUpdate( 
            {token: token},
            {password: hashedPassword},
            { new: true },
        );
        // S8: Return the response.
        return res.status(200).json( {
            success: true,
            message: "Password Reset Successful!",
        });
    }
    catch( error ) {
        console.log( error );
        return res.status(500).json( {
            success:false,
            message: "Something went wrong while resetting the password",
        });
    }
}