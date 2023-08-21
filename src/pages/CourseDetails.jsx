import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { useDispatch, useSelector } from "react-redux";
import CourseFloatingCard from "../components/core/CourseDetails/CourseFloatingCard";
import RatingStars from "../components/common/RatingStars";
import getAvgRating from "../utils/avgRating";
import { BiTime } from "react-icons/bi";
import CourseContent from "../components/core/CourseDetails/CourseContent";
import ConfirmationModal from "../components/common/ConfirmationModal"
import formatDate from "../utils/formatDate"
import Error from "./Error";

const CourseDetails = () => {
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const {loading} = useSelector((state)=>state.profile)
    const {paymenLoading} = useSelector((state) => state.course)
    const [course, setCourse] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const getCourse = async () => {
            try{
                const result = await fetchCourseDetails(courseId)
                setCourse(result.data);
                console.log(result)
            }catch(e){
                console.log("Error, unable to fetch details")
            }
        };
        getCourse();
    }, [courseId]);
    useEffect(() => {
        if (course) {
            const count = getAvgRating(course?.courseDetails.ratingAndReviews);
            setAvgReviewCount(count);
        }
    }, [course]);
    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to continue",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: ()=>navigate("/login"),
            btn2Handler: ()=>setConfirmationModal(null)
        })
    };
    const handleAddToCart = () => {};

    if (loading || !course) {
        return (
            <div className="flex h-full w-full items-center justify-center text-2xl text-richblack-5">
                Loading...
            </div>
        );
    }
    // if(!course.success){
    //     return (
    //         <Error/>
    //     )
    // }

    return (
        <div className=" text-richblack-5 flex flex-col items-center justify-center">
            <div className="bg-richblack-800 flex justify-center items-center w-full">
                <div className="flex flex-col w-[80%] my-8">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-3 w-[60%]">
                            <p className=" text-sm text-richblack-300">
                                Home / Courses /{" "}
                                <span className=" text-yellow-50 font-medium">
                                    {course?.courseDetails?.category?.name}
                                </span>
                            </p>
                            <div className="my-10 flex flex-col gap-3">
                                <h1 className=" text-3xl font-medium w-full">
                                    {course?.courseDetails?.courseName}
                                </h1>
                                <p className=" text-richblack-200 w-full">
                                    {course?.courseDetails?.courseDescription}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-100 font-semibold">
                                        {avgReviewCount || 0}
                                    </span>
                                    <RatingStars
                                        Review_Count={avgReviewCount}
                                    />
                                    <span className=" text-richblack-400">
                                        ({course?.courseDetails?.ratingAndReviews?.length}{" "}
                                        Reviews)
                                    </span>
                                    <span className=" text-richblack-100">
                                        {course?.courseDetails?.studentsEnrolled?.length}{" "}
                                        Student(s) Enrolled
                                    </span>
                                </div>
                                <div className=" text-richblack-50 font-medium text-sm">
                                    Created by{" "}
                                    {`${course?.courseDetails?.instructor?.firstName} ${course?.courseDetails?.instructor?.lastName}`}
                                </div>
                                <div className="flex gap-1 items-center text-sm text-richblack-100">
                                    <BiTime />
                                    {formatDate(course?.courseDetails?.createdAt)}
                                </div>
                            </div>
                        </div>
                        <CourseFloatingCard
                            course={course?.courseDetails}
                            handleBuyCourse={handleBuyCourse}
                            handleAddToCart={handleAddToCart}
                            courseId={courseId}
                            user={user}
                        />
                    </div>
                </div>
            </div>
            <div className="flex w-[80%] justify-start">
                <div className="my-6 border p-6 border-richblack-700 w-[65%] flex flex-col gap-4">
                    <p className="text-2xl font-bold">What you'll learn</p>
                    <p>{course?.whatYouWillLearn}</p>
                </div>
            </div>
            {/* {console.log("Yeh:",course.courseDetails)} */}
            <CourseContent course={course?.courseDetails} totalDuration={course?.totalDurationInSeconds} />
            {confirmationModal && <ConfirmationModal modalData={confirmationModal}></ConfirmationModal>}
        </div>
    );
};

export default CourseDetails;
