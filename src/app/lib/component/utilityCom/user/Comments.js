"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AllComments = ({ data,id }) => {
  
    const [descriptions, setDescriptions] = useState("");

    const InputChange = (value) => {
        setDescriptions(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            postID: id,
            descriptions: descriptions
        };

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        };

        try {
            const response = await fetch("/api/getData/newsComments", config);
            const json = await response.json();

            if (json.status === "ok") {
                toast.success("Thank you for your comment!");
                setDescriptions("");
            } else {
                toast.error("Failed to submit comment. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error("Failed to submit comment. Please try again later.");
        }
    };

    return (
        <div className="container m-auto bg-base-100 py-5 gap-3">
            <div className="dropdown w-full">
                <div tabIndex={0} role="button" className="m-1">Comments</div>
                <ul className="dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow w-full">
                    <div className="p-2 w-full">
                        <input
                            type="text"
                            placeholder="Type here"
                            value={descriptions}
                            onChange={(e) => InputChange(e.target.value)}
                            className="input input-bordered w-full" />
                        <button onClick={handleSubmit} className="mt-2 border px-3 py-1 hover:text-slate-500 rounded-xl">Submit</button>
                    </div>
                    {data.length > 0 && data.map((value,index) =>
                        <li className="bg-base-100 shadow-2xl px-1 py-2" key={value._id}>{index+1}. {value.descriptions}</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AllComments;
