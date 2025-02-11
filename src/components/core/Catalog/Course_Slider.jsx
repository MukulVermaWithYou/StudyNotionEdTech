// import React, { useEffect, useState } from "react";

// Import Swiper React components
import SwiperCore from 'swiper/core';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { FreeMode, Pagination } from 'swiper/modules';

// Initialize the modules
import Course_Card from "./Course_Card"

// import "../../.."
// Import required modules

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
SwiperCore.use([FreeMode, Pagination]);

function Course_Slider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
