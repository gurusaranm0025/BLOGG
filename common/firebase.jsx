import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYI534frg8bAPeOiTc8emTf6li9xiYPBw",
  authDomain: "bloom-blogging.firebaseapp.com",
  projectId: "bloom-blogging",
  storageBucket: "bloom-blogging.appspot.com",
  messagingSenderId: "212937630808",
  appId: "1:212937630808:web:d9183a6385d7f624a9562d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
