import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";
import { firebaseConfig } from "@/firebase/firebaseConfig";

let app, auth;
app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
console.log("Log of app");
console.log(app);
const storage = getStorage(app);

//ref for storage
export const storageRef = ref(storage);

//google auth
const gprovider = new GoogleAuthProvider();

auth = getAuth();

export async function authWithGoogle() {
  let user = null;

  await signInWithPopup(auth, gprovider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => console.log("Error fom auth with google", err));

  return user;
}
