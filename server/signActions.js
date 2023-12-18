"use server";

// import "dotenv/config"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

//google auth
import admin from "firebase-admin";
import serviceAccountKey from "../bloom-blogging-firebase-adminsdk.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

//Schema imports
import User from "@/Schema/User.js";

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
  console.log("format data");
  console.log(user);
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    status: 200,
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
}

//credential Validity checker
async function credValidityCheck(type, username, email, password) {
  if (type == "signup") {
    if (!username.length || username.length < 4) {
      return {
        status: "befSub",
        error: "Enter username with a minimum of 4 characters to continue.",
      };
    }
  }

  if (!email.length || !emailRegex.test(email)) {
    return { status: "befSub", error: "Email is invalid" };
  }

  if (!password.length || !passwordRegex.test(password)) {
    return {
      status: "befSub",
      error:
        "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters.",
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
            resolve({ status: 200, ...u._doc });
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
                resolve({ status: 200, ...user._doc });
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

//Google Auth Function
async function googleAuth(access_token) {
  const result = await getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.profile_img personal_info.fullname personal_info.username google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          console.error("Error while finding the user in DB for google auth.");
          console.error(err);
          return "error";
        });

      if (user && user != "error") {
        if (!user.google_auth) {
          return {
            status: 403,
            error:
              "This account was already signed up with password. Please log in with password to use this account.",
          };
        }
      } else {
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            username: username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = { status: 200, ...u };
          })
          .catch((err) => {
            console.error(
              "Error while saving the user from google sccount in DB"
            );
            console.error(err.message);
            return {
              status: 500,
              error: "Trouble signing with Google account, try again later.",
            };
          });
      }

      if (user.status == 200) {
        console.log(formatDataToSend(user));
        return formatDataToSend(user);
      } else if (user.status == 403) {
        console.log({ status: 500, error: user.error });
        return { status: 500, error: user.error };
      } else if (user.status == 500) {
        console.log({ status: 500 });
        return {
          status: 500,
          error: "Trouble signing with Google account, try again later.",
        };
      } else {
        console.log(formatDataToSend(user));
        return formatDataToSend(user);
      }
    })
    .catch((err) => {
      console.log(err);
      return { status: 500, error: "Failed to authenticate with Google" };
    });
  return result;
}

export { credValidityCheck, googleAuth };
