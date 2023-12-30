import { getAuth } from "firebase-admin/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export async function authWithGoogle() {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.error(err.message);
    });

  return user;
}
