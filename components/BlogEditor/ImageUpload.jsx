"use client";
import defaultBanner from "@/public/blog-banner.png";
import { EditorContext } from "@/app/editor/page";
import { UserContext } from "@/common/ContextProvider";
import { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { uploadImage } from "../ImageUpload/uploadImage";

function ImageUpload() {
  const {
    userAuth: { username },
  } = useContext(UserContext);

  let {
    blog,
    blog: { banner },
    setBlog,
  } = useContext(EditorContext);

  const metadata = {
    contentType: "image/jpeg",
  };

  async function handleBannerUpload(e) {
    let img = e.target.files[0];
    if (img) {
      const loadingToast = toast.loading("Uploading...");

      await uploadImage(img, username)
        .then((result) => {
          toast.dismiss(loadingToast);
          if (result.status == 200) {
            toast.success("Uploaded.");
            setBlog({ ...blog, banner: result.url });
          } else {
            toast.error("Upload failed.");
            console.error(result.error);
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          toast.error("Upload Failed.");
          console.error(err.message);
        });
    }
  }

  return (
    <>
      <label htmlFor="uploadBanner">
        <Toaster />
        <img
          src={banner.length ? banner : defaultBanner.src}
          className="z-20"
        />
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          hidden
          id="uploadBanner"
          onChange={handleBannerUpload}
        />
      </label>
    </>
  );
}

export default ImageUpload;
