import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { firebaseConfig } from "@/firebase/firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

//ref for storage
export const storageRef = ref(storage);

//google auth
const gprovider = new GoogleAuthProvider();

const auth = getAuth();

export async function authWithGoogle() {
  let user = null;
  await signInWithPopup(auth, gprovider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => console.log(err));

  return user;
}
