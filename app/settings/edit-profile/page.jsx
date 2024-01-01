"use client";

import { profileDataStructure } from "@/app/user/[id]/page";
import { UserContext } from "@/common/ContextProvider";
import { storeInSession } from "@/common/session";
import { uploadImage } from "@/components/ImageUpload/uploadImage";
import Loader from "@/components/Loader/Loader";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import Input from "@/components/signMethod/Input";
import { getUserProfile } from "@/server/fetchBlogs";
import { updateProfile, updateProfileImage } from "@/server/signActions";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function page() {
  let bioLimit = 150;
  let {
    userAuth,
    userAuth: { access_token, username },
    setUserAuth,
  } = useContext(UserContext);

  const socialLinksImgSrc = {
    youtube: "fa-brands fa-youtube",
    instagram: "fa-brands fa-instagram",
    github: "fa-brands fa-github",
    facebook: "fa-brands fa-facebook",
    twitter: "fa-brands fa-x-twitter",
    website: "fa-solid fa-globe",
  };

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charcLeft, setCharcLeft] = useState(bioLimit);
  let profileImgElement = useRef();
  let editProfileForm = useRef();
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  let {
    personal_info: {
      fullname,
      username: profile_username,
      profile_img,
      email,
      bio,
    },
    social_links,
  } = profile;

  useEffect(() => {
    if (access_token) {
      getUserProfile({ username })
        .then((response) => {
          setLoading(false);
          setProfile(response.user);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [access_token]);

  function imgPreviewHandler(e) {
    let img = e.target.files[0];

    profileImgElement.current.src = URL.createObjectURL(img);

    setUpdatedProfileImg(img);
  }

  function imgUploadHandler(e) {
    e.preventDefault();

    if (updatedProfileImg) {
      let loadingToast = toast.loading("Uploading...");
      e.target.setAttribute("disabled", true);

      uploadImage(updatedProfileImg, profile_username)
        .then((url) => {
          if (url) {
            updateProfileImage({ token: access_token, url: url.url })
              .then((data) => {
                let newUserAuth = {
                  ...userAuth,
                  profile_img: data.profile_img,
                };

                storeInSession("user", JSON.stringify(newUserAuth));

                setUserAuth(newUserAuth);

                setUpdatedProfileImg(null);
                toast.dismiss(loadingToast);
                toast.success("Updated.");
                e.target.removeAttribute("disabled");
              })
              .catch((err) => {
                e.target.removeAttribute("disabled");
                console.error(err.message);
                toast.dismiss(loadingToast);
                return toast.error(
                  "Error occurred while updating the profile image"
                );
              });
          }
        })
        .catch((err) => {
          e.target.removeAttribute("disabled");
          toast.dismiss(loadingToast);
          console.error(err.message);
          return toast.error("Error occurred while updating the profile image");
        });
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    let form = new FormData(editProfileForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let {
      username,
      bio,
      twitter,
      youtube,
      facebook,
      github,
      instagram,
      website,
    } = formData;

    if (username.length < 4) {
      return toast.error(
        "Enter username with a minimum of 4 characters to continue"
      );
    }

    if (bio.length > bioLimit) {
      return toast.error("Bio should not contain more than 150 character");
    }

    let loadingToast = toast.loading("Updating...");

    e.target.setAttribute("disabled", true);

    updateProfile({
      token: access_token,
      username,
      bio,
      social_links: { youtube, facebook, twitter, github, instagram, website },
    })
      .then((response) => {
        if (response.status == 200) {
          if (userAuth.username != response.username) {
            let newUserAuth = { ...userAuth, username: response.username };

            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);
          }

          toast.dismiss(loadingToast);

          e.target.removeAttribute("disabled");
          return toast.success("Profile Updated successfully");
        } else {
          toast.dismiss(loadingToast);
          console.log(response.error);
          e.target.removeAttribute("disabled");
          return toast.error(response.message);
        }
      })
      .catch((err) => {
        console.log(err);
        e.target.removeAttribute("disabled");
        toast.dismiss(loadingToast);
        return toast.error("Error occurred while updating your profile");
      });
  }

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfileForm}>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col md:flex-row items-start py-10 gap-8 md:gap-10">
            <div className="max-lg:center mb-5 ">
              <label
                className="relative block w-48 h-48 bg-gray-300 rounded-full overflow-hidden object-cover"
                htmlFor="uploadImage"
                id="profileImgLabel"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer duration-500">
                  Upload Image
                </div>
                <img
                  ref={profileImgElement}
                  className="pointer-events-none"
                  src={profile_img}
                  alt="profile-image"
                />
              </label>
              <input
                type="file"
                id="uploadImage"
                accept=".jpeg, .png, .jpg"
                hidden
                onChange={imgPreviewHandler}
              />

              <button
                className="btn-light mt-5 max-lg:center lg:w-full px-10"
                onClick={imgUploadHandler}
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 ">
                <div>
                  <Input
                    name={"fullname"}
                    type={"text"}
                    value={fullname}
                    placeholder={"Full Name"}
                    disabled={true}
                    icon={"user"}
                  />
                </div>
                <div>
                  <Input
                    name={"email"}
                    type={"email"}
                    value={email}
                    placeholder={"Email"}
                    disabled={true}
                    icon={"email"}
                  />
                </div>
              </div>

              <Input
                name={"username"}
                type={"text"}
                value={profile_username}
                icon={"user"}
                placeholder={"Username"}
              />
              <p>
                Username is used to search for particular users and it is
                visible to others.{" "}
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5 font-montserrat font-normal text-md bg-gunmetal/10 rounded-md outline-none selection:bg-rose-quartz focus:outline-rose-quartz/80 focus:bg-gray-300 placeholder:text-gray-800 text-black duration-200"
                placeholder="Bio"
                onChange={(e) => setCharcLeft(bioLimit - e.target.value.length)}
              ></textarea>
              <p className="mt-1 text-cadet-gray">
                {charcLeft} characters left
              </p>

              <p className="my-6 text-gray-700">Edit your social handles</p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  let link = social_links[key];
                  return (
                    <Input
                      key={i}
                      name={key}
                      type={"text"}
                      value={link}
                      placeholder={"https://"}
                      icon={"fa"}
                      iconVal={socialLinksImgSrc[key]}
                    />
                  );
                })}
              </div>

              <button
                className="btn-dark w-auto px-10 mt-5"
                type="submit"
                onClick={submitHandler}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
}

export default page;
