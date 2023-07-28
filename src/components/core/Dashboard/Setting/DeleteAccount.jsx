import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteProfile } from "../../../../services/operations/settingsAPI";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {token} = useSelector((state)=>state.auth)

    const deleteHandler = ()=>{
        dispatch(deleteProfile(token, navigate))
    }

    return (
        <div className="w-[80%] bg-pink-900 gap-4 flex flex-row p-6 rounded-lg border border-pink-700">
            <div className=" bg-pink-700 rounded-full h-max p-3">
                <RiDeleteBin6Line className=" text-pink-200 text-3xl" />
            </div>
            <div className=" flex flex-col gap-2">
                <h2 className=" text-lg font-bold text-pink-5">
                    Delete Account
                </h2>
                <div className="w-[75%]">
                    <p className="text-pink-25">
                        Would you like to delete account?
                    </p>
                    <p className=" text-pink-25">
                    This account may contain Paid Courses. Deleting your account is permanent and will remove all the contain associated with it.
                    </p>
                </div>
                <p onClick={()=>deleteHandler()} className="cursor-pointer italic text-pink-300">I want to delete my account.</p>
            </div>
        </div>
    );
};

export default DeleteAccount;
