import { combineReducers } from "@reduxjs/toolkit"
// This could also be named as the store of the entire application, but it is what it is.

import authReducer from "../slices/authSlice"
import cartReducer from "../slices/cartSlice"
import profileReducer from "../slices/profileSlice"
import courseReducer from "../slices/courseSlice"
// import viewCourseReducer from "../slices/viewCourseSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  profile: profileReducer,
  course: courseReducer,
//   viewCourse: viewCourseReducer,
})

export default rootReducer;
