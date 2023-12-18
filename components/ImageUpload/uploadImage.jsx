"use client";

import { storageRef } from "@/common/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

export async function uploadImage(files, username) {
  const metadata = {
    contentType: "image/jpeg",
  };

  const randName = files.name + nanoid().substring(0, 6) + ".jpeg";
  const imageRef = ref(storageRef, `images/${username}/${randName}`);

  let imageUrl = null;

  await uploadBytes(imageRef, files, metadata)
    .then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        imageUrl = { status: 200, url: url };
      });
    })
    .catch((err) => {
      imageUrl = { status: 500, error: err.message };
      console.log(err.message);
    });

  return imageUrl;
}
