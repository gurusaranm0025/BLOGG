import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { getStorage, ref } from "firebase/storage";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getAuth } from "firebase-admin/auth";

export const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig, "bloom-blogging")
    : getApps()[0];

// const provider = new GoogleAuthProvider();

// const auth = getAuth();

// export async function authWithGoogle() {
//   let user = null;

//   await signInWithPopup(auth, provider)
//     .then((result) => {
//       user = result.user;
//     })
//     .catch((err) => {
//       console.error(err.message);
//     });

//   return user;
// }

const storage = getStorage();

export const storageRef = ref(storage);
