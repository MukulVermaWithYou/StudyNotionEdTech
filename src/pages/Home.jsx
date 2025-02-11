import React from 'react';

import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

import { HighlightText } from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/Timeline';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection'; 
import ExploreMore from '../components/core/HomePage/ExploreMore';
import Footer from '../components/common/Footer';

export const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className= 'relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

            {/* Become a Instructor Button */}
            <Link to = {"/signup"}>

                <div className='group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 shadow-[rgba(50,50,93,0.25)_0px_2px_3px_-2px,_rgba(0,0,0,0.3)_0px_3px_1px_-3px] shadow-white transition-all duration-200 hover:scale-95 hover:shadow-none'>
                    <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                        <p> Become an Instructor </p>
                        <HiOutlineArrowNarrowRight/>
                    </div>
                </div>
            </Link>

            <div className=' text-4xl font-semibold mt-7 text-center'> 
              Empower your future with <HighlightText text = {"Coding Skills"} />
            </div>

            <div className=' mt-5 text-richblack-300 text-center font-semibold'> 
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            { /* Two Buttons, with their flag to determine their colour */ }
            <div className=' flex flex-row mt-8 gap-5' > 
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                Book a Demo
              </CTAButton>
            </div>

            {/* Video */}
            <div className=" mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200 ">
              <video
                className="shadow-[10px_10px_rgba(255,255,255)]"
                muted
                loop
                autoPlay
              >
                <source src={Banner} type="video/mp4" />
              </video>
            </div>

            {/* Code Section 1  */}
            <div>
              <CodeBlocks
                position={"lg:flex-row"}

                heading={
                  <div className="text-4xl font-semibold">
                    Unlock your
                    <HighlightText text={"coding potential"} /> with our online
                    courses.
                  </div>
                }

                subheading =
                {
                  "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                
                // Creating custom properties objects for the purpose of easy de-referencing!
                ctabtn1={ {
                  btnText: "Try it Yourself",
                  link: "/signup",
                  active: true,
                } }
                ctabtn2={ {
                  btnText: "Learn More",
                  link: "/signup",
                  active: false,
                } }

                codeColor={"text-yellow-25"}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is my Page</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
              />
            </div>

            {/* Code Section 2 */}
            <div>
              <CodeBlocks
                position={"lg:flex-row-reverse"}

                heading={
                  <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                    Start <HighlightText text={"coding in seconds"} />
                  </div>
                }

                subheading={
                  "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }

                ctabtn1={ {
                  btnText: "Continue Lesson",
                  link: "/signup",
                  active: true,
                } }

                ctabtn2={ {
                  btnText: "Learn More",
                  link: "/signup",
                  active: false,
                } }

                codeColor={"text-white"}

                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}

                backgroundGradient={<div className="codeblock2 absolute"></div>}
              />
            </div>

            {/* Explore Section */}
            <div className='m-7'>
              <ExploreMore />
            </div>
        </div>

        {/* Section 2 */}
        <div className='bg-pure-greys-5'>
          <div className='text-richblack-700' > 
              <div className=' homepage_bg h-[300px]'>

                {/* Container Div for the white background */}
                <div className=' w-11/12 max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto '>

                    {/* Empty div to consume top space [Look for alternatives]*/}
                    <div className='h-[130px]'> </div>

                    {/* Flex to contain the buttons*/}
                    <div className=' flex flex-row gap-5 text-white'>

                        <CTAButton active={true} linkto="/signup">
                          <div className=' flex items-center gap-3'> Explore full catalog <HiOutlineArrowNarrowRight /> </div>
                        </CTAButton>

                        <CTAButton active={false} linkto="/signup">
                          <div className=' flex items-center gap-3'> Learn More </div>
                        </CTAButton>
                    </div>
                </div>
              </div>
          </div>

          <div className=" mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-black">
            
            {/* Job that is in Demand - Section 1 */}
            <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
              
              <div className="text-4xl font-semibold lg:w-[45%] ">
                Get the skills you need for a{" "}
                <HighlightText text={"job that is in demand."} />
              </div>

              <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                <div className="text-[16px]">
                  The modern StudyNotion is the dictates its own terms. Today, to
                  be a competitive specialist requires more than professional
                  skills.
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="">Learn More</div>
                </CTAButton>
              </div>
            </div>

            {/* Timeline Section - Section 2 */}
            <TimelineSection />

            {/* Learning Language Section - Section 3 */}
            <LearningLanguageSection />

          </div>
        </div>


        {/* Section 3 */}
        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
          {/* Become an instructor section */}
          <InstructorSection />

          {/* Reviws from Other Learner */}
          <h1 className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners
          </h1>
    
        </div>
        
        {/* Footer */}
        <div>
          <Footer />
        </div>
    </div>
  )
}
