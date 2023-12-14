"use server";

import { useAnimate } from "framer-motion";
// import "dotenv/config"
import mongoose from "mongoose";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

function credValidityCheck(type, username, email, password) {
  if (type == "signup") {
    if (!username.length || username.length < 4) {
      return { error: "Enter username to continue." };
    }
  }

  if (!email.length) {
    return { error: "Enter a valid email to continue." };
  }

  if (!password.length) {
    return { error: "Enter a valid passowrd to continue." };
  }

  if (!emailRegex.test(email)) {
    return { error: "Email is invalid." };
  }

  if (!passwordRegex.test(password)) {
    return {
      error:
        "Passowrd is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters.",
    };
  }
}

export { credValidityCheck };
