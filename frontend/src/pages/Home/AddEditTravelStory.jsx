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
    <div className="relative bg-white shadow-md p-4 rounded-lg">
      {/* Header Section */}
      <div className="flex sm:flex-row items-center sm:items-center justify-between  pb-4">
        <h5 className="text-base md:text-2xl font-semibold text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        {/* Buttons Section */}
        <div className="btn-small flex items-center gap-0.5 md:gap-2 bg-cyan-50/50 p-2 rounded-lg text-sky-500 hover:text-white  ">
          <button
            className="flex items-center gap-2 text-sm md:text-base "
            onClick={handleAddOrUpdateClick}
            disabled={loadingStatus !== ""}
          >
            {loadingStatus === "Adding..." || loadingStatus === "Updating..." ? (
              <span>{loadingStatus}</span>
            ) : (
              <>
                {type === "add" ? (
                  <>
                    <MdAdd className="text-base md:text-lg" />
                    <span className="text-xs md:text-sm  ">
                      ADD STORY
                    </span>
                  </>
                ) : (
                  <>
                    <MdUpdate className="text-base md:text-lg" />
                    <span className="text-xs md:text-base">
                      UPDATE STORY
                    </span>
                  </>
                )}
              </>
            )}
          </button>
          <button onClick={onClose}>
            <MdClose className=" text-lg md:text-xl" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs md:text-sm pt-2 text-right">
          {error}
        </p>
      )}

      {/* Form Section */}
      <div className="flex-1 flex flex-col gap-4 pt-4">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="input-label text-sm md:text-base">TITLE</label>
          <input
            type="text"
            className="text-base md:text-base text-slate-950 outline-none focus:ring-0"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* Date Selector */}
        <div className="my-2">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        {/* Image Selector */}
        <ImageSelector
          image={storyImg}
          setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}
        />

        {/* Story Input */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="input-label text-sm md:text-base">STORY</label>
          <textarea
            className="text-sm md:text-base text-slate-950 outline-none bg-slate-50 p-3 rounded-lg resize-none focus:ring-0"
            placeholder="Your Story"
            rows={8}
            value={story}
            onChange={({ target }) => setStory(target.value)}
          />
        </div>

        {/* Visited Locations */}
        <div className="">
          <label className="input-label text-sm md:text-base">
            VISITED LOCATIONS
          </label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
        </div>
      </div>

      {/* Loading Status */}
      {loadingStatus && (
        <p className="text-blue-500 text-sm md:text-base pt-4">
          {loadingStatus}
        </p>
      )}
    </div>
  

      

    );
};

export default AddEditTravelStory;
