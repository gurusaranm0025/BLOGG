// "use client";
//importing tools
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../ImageUpload/uploadImage";
import dynamic from "next/dynamic";

//importing tools dynamically
// import dynamic from "next/dynamic";

// const Embed = dynamic(() => import("@editorjs/embed"));
// const Image = dynamic(() => import("./@editorjs/image"), { ssr: false });

function uploadImageByUrl(e) {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
}

function uploadImageByFile(e) {
  return uploadImage(e, "blog-images")
    .then((result) => {
      if (result.status == 200) {
        const url = result.url;
        return {
          success: 1,
          file: { url },
        };
      }
    })
    .catch((err) => {
      alert("error", err.message);
    });
}

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Enter a header",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  inlineCode: InlineCode,
};

export const EditorJS = dynamic(() => import("@editorjs/editorjs"), {
  ssr: false,
});
