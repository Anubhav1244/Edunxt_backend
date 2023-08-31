import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import { FaPlay } from "react-icons/fa";
import IconBtn from "../../common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import "video-react/dist/video-react.css";

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const playerRef = useRef();
    const {token} = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } =
        useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setVideoSpecificDetails = async () => {
            if (!courseSectionData.length) {
                return;
            }
            if (!courseId && !sectionId && !subSectionId) {
                navigate("/dashboard/enrolled-courses");
            } else {
                const filteredData = courseSectionData.filter(
                    (section) => section._id === sectionId
                );
                const filteredVideoData = filteredData?.[0].subSections.filter(
                    (subSection) => subSection._id === subSectionId
                );
                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        };
        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );
        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);
        if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
            return true;
        } else {
            return false;
        }
    };
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );
        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);
        const noOfSubSections =
            courseSectionData[currentSectionIndex].subSections.length;
        if (
            currentSectionIndex === courseSectionData.length - 1 &&
            currentSubSectionIndex === noOfSubSections - 1
        ) {
            return true;
        } else {
            return false;
        }
    };
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

        const noOfSubSections =
            courseSectionData[currentSectionIndex].subSections.length;
        if (currentSubSectionIndex !== noOfSubSections - 1) {
            //Same section ki next video
            const nextSubSectionId =
                courseSectionData[currentSectionIndex].subSections[
                    currentSectionIndex + 1
                ]._id;
            //Navigating to next video
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
            );
        } else {
            const nextSectionId =
                courseSectionData[currentSectionIndex + 1]._id;
            const firstSubSectionId =
                courseSectionData[currentSectionIndex + 1].subSections[0]._id;
            navigate(
                `/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubSectionId}`
            );
        }
    };
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[
            currentSectionIndex
        ].subSections.findIndex((data) => data._id === subSectionId);

        const noOfSubSections =
            courseSectionData[currentSectionIndex].subSections.length;
        if (currentSubSectionIndex !== 0) {
            //Same section ki prev video
            const prevSubSectionId =
                courseSectionData[currentSectionIndex].subSections[
                    currentSubSectionIndex - 1
                ]._id;
            //Navigating to prev video
            navigate(
                `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
            );
        } else {
            const prevSectionId =
                courseSectionData[currentSectionIndex - 1]._id;
            const prevSectionLength =
                courseSectionData[currentSectionIndex - 1].subSections.length;
            const lastSubSectionId =
                courseSectionData[currentSectionIndex - 1].subSections[
                    prevSectionLength - 1
                ]._id;
            navigate(
                `/view-course/${courseId}/section/${prevSectionId}/sub-section/${lastSubSectionId}`
                );
            }
        };
    const handleLectureCompletion = async () => {
        // we are writing dummy code that needs to be replaced later on
        setLoading(true);

        const res = await markLectureAsComplete(
            {
                courseId: courseId,
                subSectionId: subSectionId,
            },
            token
        );

        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };
    return (
        <div className=" text-richblack-5">
            {!videoData ? (
                <div>No video found</div>
            ) : (
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData?.videoUrl}
                >
                    <FaPlay />
                    {videoEnded && (
                        <div>
                            {!completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    customClasses={
                                        "bg-yellow-50 text-richblack-900 font-semibold flex items-center justify-center gap-2 rounded-lg px-5 py-3 shadow-[2px_2px_0px_0px_rgba(255,214,10,0.6)] hover:scale-95 transition-all duration-200 hover:shadow-none"
                                    }
                                    disabled={loading}
                                    onclick={()=>handleLectureCompletion()}
                                    text={
                                        loading
                                            ? "Loading..."
                                            : "Mark as completed"
                                    }
                                />
                            )}
                            <IconBtn
                                customClasses={
                                    "bg-yellow-50 text-richblack-900 font-semibold flex items-center justify-center gap-2 rounded-lg px-5 py-3 shadow-[2px_2px_0px_0px_rgba(255,214,10,0.6)] hover:scale-95 transition-all duration-200 hover:shadow-none"
                                }
                                disabled={loading}
                                onclick={() => {
                                    if (playerRef?.current) {
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text={"Rewatch"}
                            />
                            <div>
                                {!isFirstVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToPrevVideo}
                                        className=" bg-richblack-800"
                                    >
                                        Prev
                                    </button>
                                )}
                            </div>
                            <div>
                                {!isLastVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={goToNextVideo}
                                        className=" bg-richblack-800"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Player>
            )}
            <h1>{videoData?.title}</h1>
            <p>{videoData?.description}</p>
        </div>
    );
};

export default VideoDetails;