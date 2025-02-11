
// Importing the required packages.
const jwt = require( "jsonwebtoken" );
require( "dotenv" ).config();
const User = require( "../models/User" ); 

// auth
exports.auth = async( req, res, next ) => {

    try {

        // 1. Extract any pre-existing token
        const token = req.cookies.token || 
                        req.body.token || 
                        req.header( "Authorization" ).replace("Bearer ", "");

        // If the token is missing, then return the response.
        if( !token ) {
            return res.status( 401 ).json( {
                success: false,
                message: "Token is Missing!", 
            });
        }

        // Otherwise, we do have an existing token, 
        // Time to verify it!
        try {

            const decode = jwt.verify( token, process.env.JWT_SECRET );
            console.log( decode );
            req.user = decode;

        }
        catch( err ) {
            // Issue in verification.
            return res.status( 401 ).json( {
                success: false,
                message: "Token is Invalid",
            });

        }
        next(); 
    }
    catch( error ) {
        return res.status( 401 ).json( {
            success: false,
            message: "Something went wrong while validating the token!",
        });
    }
};

// isStudent
exports.isStudent = async( req, res, next ) => {

    try {
        if( req.user.accountType !== "Student" ) {
            return res.status( 401 ).json( {
                success: false,
                message: "This is a protected route for Students only",
            });
        }
        next();
    }
    catch( error ) {

        return res.result( 500 ).json( {
            success: false,
            message: "User Role can not be verified, please try again."
        })
    }
}

// isInstructor
exports.isInstructor = async( req, res, next ) => {

    try {
        if( req.user.accountType !== "Instructor" ) {
            return res.status( 401 ).json( {
                success: false,
                message: "This is a protected route for Instructor only",
            });
        }
        next();
    }
    catch( error ) {

        return res.result( 500 ).json( {
            success: false,
            message: "User Role can not be verified, please try again."
        })
    }
}



// isAdmin
exports.isAdmin = async( req, res, next ) => {

    try {
        if( req.user.accountType !== "Admin" ) {
            return res.status( 401 ).json( {
                success: false,
                message: "This is a protected route for Admin only",
            });
        }
        next();
    }
    catch( error ) {

        return res.result( 500 ).json( {
            success: false,
            message: "User Role can not be verified, please try again."
        })
    }
}