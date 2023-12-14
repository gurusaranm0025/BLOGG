"use server";

// import "dotenv/config"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

//Schema imports
import User from "@/Schema/User.js";
import { resolve } from "styled-jsx/css";

//regex
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//mongoose
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

//functions
//username Generator
async function generateUsername(email) {
  let username = email.split("@")[0];
  const isUserExists = await User.exists({
    personal_info: { username: username },
  }).then((res) => res);

  isUserExists ? (username += nanoid().substring(0, 5)) : "";
  return username;
}

//format data to send
function formatDataToSend(user) {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    status: 200,
    access_token,
    profile_img: user.profile_img,
    username: user.username,
    fullname: user.fullname,
  };
}

//credential Validity checker
async function credValidityCheck(type, username, email, password) {
  if (type == "signup") {
    if (!username.length || username.length < 4) {
      return {
        status: "befSub",
        error: "username",
      };
    }
  }

  if (!email.length || !emailRegex.test(email)) {
    return { status: "befSub", error: "email" };
  }

  if (!password.length || !passwordRegex.test(password)) {
    return {
      status: "befSub",
      error: "password",
    };
  }

  if (type == "signup") {
    const hashResponse = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, async (err, hashed_pass) => {
        if (err) resolve({ status: 500, error: "Sorry, error ocurred." });
        const generatedUsername = await generateUsername(email);
        const user = new User({
          personal_info: {
            fullname: username,
            email,
            password: hashed_pass,
            username: generatedUsername,
          },
        });

        user
          .save()
          .then((u) => {
            resolve({ status: 200, ...u.personal_info });
          })
          .catch((err) => {
            if (err.code == 11000) {
              console.log("error");
              console.log(err);
              resolve({ status: 403, error: "Email already exists" });
            } else {
              resolve({ status: 500, error: err });
            }
          });
      });
    });

    if (hashResponse.status == 200) return formatDataToSend(hashResponse);
    return hashResponse;
  }

  if (type == "signin") {
    const result = await User.findOne({
      "personal_info.email": email,
    })
      .then((user) => {
        if (!user) {
          return { status: "404", error: "Email not found.", ...user };
        }

        const passCheck = new Promise((resolve, reject) => {
          bcrypt.compare(
            password,
            user.personal_info.password,
            (err, result) => {
              if (err) {
                resolve({ status: 500, error: err.message });
              }

              if (!result) {
                resolve({ status: 405, error: "Password is wrong" });
              } else {
                resolve({ status: 200, ...user.personal_info });
              }
            }
          );
        });

        return passCheck;
      })
      .catch((err) => {
        console.log(err);
        return { status: 404, error: err.message };
      });
    console.log(result);

    if (result.status == 200) return formatDataToSend(result);
    return result;
  }
}

export { credValidityCheck };
