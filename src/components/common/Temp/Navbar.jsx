import React, { useEffect } from 'react'
import { useLocation, Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from  "../../data/navbar-links"
import ProfileDropdown from '../core/Auth/ProfileDropdown'
import { useSelector } from 'react-redux'

import { FaShoppingCart } from "react-icons/fa";
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'

import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {

    const location = useLocation();
    const { token } = useSelector((state) => state.auth )
    const { user } = useSelector((state) => state.profile )
    const totalItems = useSelector( (state) => state.totalItems );


    // [subLinks, setSubLinks] = useState([])

    // const fecthSubLinks = () => {
    //     async () => {
    //         try {
    //             const result = await apiConnector( "GET", categories.CATEGORIES_API );
    //             console.log( "Printing Sublinks result: ", result );
    //             setSubLinks( result.data.data );
    //         }
    //         catch( error ) {
    //             console.log( "Could not fetch the category list" )
    //         }
    //     }
    // }

    // useEffect( () => { 
    //     fecthSubLinks();
    // }, [] )

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname );
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        
        {/* Adding the Logo Image to homepage */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>


        {/* Adding the Navigation Links on the Navigation Bar */}
        {/* Navigation links */}
        <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
            {
                NavbarLinks.map( (link, index) => (
                    <li key = {index} >
                        {link.title === "Catalog" ? (
                        <div className= 'flex items-center' > 
                        <p> {link.title} </p> 
                        <IoIosArrowDown /> 
                        </div> ) : (
                        <Link to={link?.path}>
                            <p className={ `${ matchRoute(link?.path) ? "font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-pink-300"  : "text-richblack-25" }` }>
                                {link.title}
                            </p> 
                        </Link> )}
                    </li>
                ) )

            }
            </ul>
        </nav>

        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">

            {/* If the user is not an instructor, and we have the user data available, show the cart */}
            { user && user?.accountType !== "Instructor" && (
                <Link to="/dashboard/cart" className="relative" >
                <FaShoppingCart  className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                    </span>
                )}
                </Link>
            )}

            {/* If there's no user login data available, prompt to Login button */}
            { token === null && (
                <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Log in
                </button>
                </Link>
            )}

            {/* If there's no user login data available, prompt to Signup button */}
            { token === null && (
                <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                    Sign up
                </button>
                </Link>
            )}

            { token !== null && <ProfileDropdown />}

        </div>

        </div>
    </div>
  )
}

export default Navbar