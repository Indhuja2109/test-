import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import moment from "moment";
import { toast } from "react-toastify";

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || moment().toISOString());

    const [error, setError] = useState("");
    const [loadingStatus, setLoadingStatus] = useState(""); // Track loading status

    // Add New Travel Story
    const addNewTravelStory = async () => {
        try {
            setLoadingStatus("Adding..."); // Set status to "Adding"

            let imageUrl = "";
            if (storyImg && storyImg instanceof File) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl;
            } else {
                throw new Error("Image is required");
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            console.error("Error adding story:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoadingStatus(""); // Reset loading status
        }
    };

    // Update Travel Story
    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            setLoadingStatus("Updating..."); // Set status to "Updating"

            let imageUrl = storyInfo.imageUrl || "";
            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const postData = {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            };

            const response = await axiosInstance.put("/edit-story/" + storyId, postData);

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            console.error("Error updating story:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoadingStatus(""); // Reset loading status
        }
    };

    // Delete Story Image
    const handleDeleteStoryImg = async () => {
        try {
            setLoadingStatus("Deleting..."); // Set status to "Deleting"

            const deleteImgRes = await axiosInstance.delete("/delete-image", {
                params: { imageUrl: storyInfo.imageUrl },
            });

            if (deleteImgRes.data) {
                const postData = {
                    title,
                    story,
                    visitedLocation,
                    visitedDate: moment().valueOf(),
                    imageUrl: "",
                };

                await axiosInstance.put("/edit-story/" + storyInfo._id, postData);
                setStoryImg(null);
                toast.success("Image Deleted Successfully");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            setError("Failed to delete image.");
        } finally {
            setLoadingStatus(""); // Reset loading status
        }
    };

    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!story) {
            setError("Please enter the story");
            return;
        }

        setError("");
        if (type === "edit") updateTravelStory();
        else addNewTravelStory();
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div>
                    <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                        {type === "add" ? (
                            <button
                                className="btn-small"
                                onClick={handleAddOrUpdateClick}
                                disabled={loadingStatus !== ""}
                            >
                                {loadingStatus === "Adding..." ? "Adding..." : <><MdAdd className="text-lg" /> ADD STORY</>}
                            </button>
                        ) : (
                            <>
                                <button
                                    className="btn-small"
                                    onClick={handleAddOrUpdateClick}
                                    disabled={loadingStatus !== ""}
                                >
                                    {loadingStatus === "Updating..." ? "Updating..." : <><MdUpdate className="text-lg" /> UPDATE STORY</>}
                                </button>
                            </>
                        )}
                        <button className="" onClick={onClose}>
                            <MdClose className="text-xl text-slate-400" />
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-xs pt-2 text-right">{error}</p>}
                </div>
            </div>

            <div>
                <div className="felx-1 flex flex-col gap-2 pt-4">
                    <label className="input-label">TITLE</label>
                    <input
                        type="text"
                        className="text-2xl text-slate-950 outline-none"
                        placeholder="A Day at the Great Wall"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />

                    <div className="my-3">
                        <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>

                    <ImageSelector
                        image={storyImg}
                        setImage={setStoryImg}
                        handleDeleteImg={handleDeleteStoryImg}
                    />

                    <div className="flex flex-col gap-2 mt-4">
                        <label className="input-label">STORY</label>
                        <textarea
                            type="text"
                            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                            placeholder="Your Story"
                            rows={10}
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>

                    <div className="pt-3">
                        <label className="input-label">VISITED LOCATIONS</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>
                </div>
            </div>

            {/* Display Loading Status */}
            {loadingStatus && (
                <p className="text-blue-500 text-sm pt-4">{loadingStatus}</p>
            )}
        </div>
    );
};

export default AddEditTravelStory;
