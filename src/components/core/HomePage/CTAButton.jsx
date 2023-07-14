import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children, active, linkto}) => {
    return (
    <Link to={linkto}>
        <div className={`text-center px-[24px] py-[12px] rounded-[8px] font-medium ${active? "bg-yellow-50 text-black" : "bg-richblack-800 text-richblack-5"} hover:scale-95 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]`}>
            {children}
        </div>
    </Link>
  )
}

export default CTAButton