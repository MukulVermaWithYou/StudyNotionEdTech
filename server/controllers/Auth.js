
// We would be requiring the following models in our functions.
const User = require( "../models/User" );
const Profile = require( "../models/Profile" );
const OTP = require( "../models/OTP" );
const otpGenerator = require( "otp-generator" );
const bcrypt = require( "bcrypt" ); 
const jwt = require( "jsonwebtoken" );


require( "dotenv" ).config();

// Send OTP for Email Verification
exports.sendOTP = async( req, res ) => {

    try {

        // Fetching the email of the recipient from the request body.
        const {email} = req.body;

        // Checking if the user already exists in the database (using the e-mail ID of course )
        const checkUserPresent = await User.findOne( {email} );

        if( checkUserPresent ) {
            // Return 401 Unauthorized status code with error message
            return res.status( 401 ).json( {
                success:false,
                message:'User already registered!',
            })
        }

        // Else User does not exist!
        // Time to generate the otp.

        var otp = otpGenerator.generate( 6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log( "The OTP Generated is: " + otp );

        // Check whether it is a unique OTP
        console.log( "Till here " + otp );
        let result = await OTP.findOne( {otp: otp} );

        while( result ) {

            otp = otpGenerator( 6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });


            result = await OTP.findOne( {otp: otp} );
        }

        const otpPayload = {email, otp};

        // Create an entry for the OTP in the database.
        const otpBody = await OTP.create( otpPayload );
        console.log( otpBody );

        // Return the response for successful OTP generation.
        res.status(200).json( {
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })
    }
    catch( error ) {

        console.log(error);
        return res.status( 500 ).json( {
            success: false,
            message: error.message,
        })
    }
};


// Sign Up
exports.signUp = async ( req, res ) => {
    
    try {
        // Fetch the data from the request body.
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // Perform all sorts of required data validation checks.

        if( !firstName || !lastName || !email || !password || !confirmPassword || !otp ) {
            return res.status( 403 ).json( {
                success: false,
                message: "All data fields are required",
            });
        }


        // Compare the 2 Passwords entered.
        if( password !== confirmPassword ) {
            return res.status( 400 ).json( {
                success: false,
                message: "Password and ConfirmPassword do not match",
            });
        }
        
        // Check if the user already exists.
        const existingUser = await User.findOne( {email} );
        if( existingUser ) {
            return res.status(400).json({
                success: false,
                message: `User is Already Registered`,
              })
        }
        

        // Find the most recent OTP entry for the corresponding user.
        const recentOTP = await OTP.find( {email} ).sort( {createdAt: -1} ).limit(1)
        console.log( recentOTP );


        // Validate the OTP with the one entered.
        if( recentOTP.length === 0 ) {
            // OTP not found.
            return res.status( 400 ).json( {
                success: false,
                message: "OTP Not Found",
            });
        }
        else if( otp !== recentOTP[0].otp ) {
            // Invalid OTP
            return res.status( 400 ).json( {
                success: false,
                message: "OTP doesn't match the sent OTP",
            });
        }

        // Hash the password of the user.
        const hashedPassword = await bcrypt.hash( password, 10 );
        // Create the entry in the DB.

        // Create the dummy user profile, using place-holder values.
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

            // Since we would require a profile reference in the additional details, creating a dummy profile for the reference of the object.
            const profileDetails = await Profile.create( {
                gender: null,
                datOfBirth: null,
                about: null,
                contactNumber: null,    
            });

        // const user = await User.create( {
        //     firstName,
        //     lastName,
        //     email,
        //     contactNumber,
        //     password: hashedPassword,
        //     accountType,
        //     additionalDetails: profileDetails._id,
        //     image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        // });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
          })

        // Return Response.
        return res.status( 200 ).json( {
            success: true,
            message: "User registered successfully!",
            user,
        });
    }
    catch( error ) {
        console.log(error);
        return res.status( 500 ).json( {
            success: false,
            message: "User could not be registered, Please try again",
        });
    }
}

// Login
exports.login = async( req, res ) => {
    try {

        // 1. Extract the data from the request body.
        const {email, password} = req.body;

        // 2. Validate the data.
        if( !email || !password ) {
            return res.status( 403 ).json( {
                success: false,
                message: "All fields are required, please try again.",
            });
        }

        // 3. Check if the user exists or not using the email ID.
        const user = await User.findOne({ email });

        if( !user ) {
            return res.status( 401 ).json( {
                success: false,
                message: "User is not registered, first sign up!",
            });
        }

        // 4. Generate the JWT token, but provide only after the password verification.
        if( await bcrypt.compare( password, user.password ) ) {
            
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign( payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            // 5. Create the cookie and sent the response.
            const options = {
                expires: new Date( Date.now() + 3*24*60*60*1000 ),
                httpOnly: true,
            }
            // Naming the cookie as token
            res.cookie( "token", token, options ).status(200).json( {
                success: true,
                token,
                user,
                message: "Logged In Successfully!",
            })
        }
        else {
            return res.status( 401 ).json( {
                success: false,
                message: "Password is incorrect!",
            })
        }
    }  
    catch( error ) {
        console.log( error );

        return res.status( 500 ).json( {
            success: false,
            message: "Login Failure, Please Try Again",
        });
    }
};  

// Change Password

// exports.changePassword = async( req, res ) => {

    // 1. Extract the data from Req Body
    // 2. Get Old Password, New Password, ConfirmationPassword.
    // 3. Perform Validation

    // 4. Update the password in Database.
    // 5. Send Mail - Password Updated.
    // 6. Return the response.
// };

// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id)
    
        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword } = req.body
    
        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
                                                oldPassword,
                                                userDetails.password
                                            )
        if (!isPasswordMatch) {
            // If old password does not match, return 401 (Unauthorized) error
            return res.status(401).json({ 
                success: false, 
                message: "The password is incorrect" 
            });
        }
  
        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUserDetails = await User.findByIdAndUpdate(
                                            req.user.id,
                                            { password: encryptedPassword },
                                            { new: true }
                                        );
  
        // Send notification email.
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            
            console.log("Email sent successfully:", emailResponse.response);

        } 
        catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }
  
        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        })

    } catch (error) {
        // If there's an error updating the password, log the error and return 500 (Internal Server Error) error.

        console.error("Error occurred while updating password:", error);

        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
  }
  