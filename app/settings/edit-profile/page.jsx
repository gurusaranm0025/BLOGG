"use client";

import { profileDataStructure } from "@/app/user/[id]/page";
import { UserContext } from "@/common/ContextProvider";
import Loader from "@/components/Loader/Loader";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import Input from "@/components/signMethod/Input";
import { getUserProfile } from "@/server/fetchBlogs";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

function page() {
  let bioLimit = 150;
  let {
    userAuth: { access_token, username },
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

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form>
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
              />

              <button className="btn-light mt-5 max-lg:center lg:w-full px-10  ">
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

              <button className="btn-dark w-auto px-10" type="submit">
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
