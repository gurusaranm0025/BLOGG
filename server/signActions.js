"use server";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { tokenVerify } from "./fetchBlogs";

//google auth
import admin from "firebase-admin";
import serviceAccountKey from "../bloom-blogging-firebase-adminsdk.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
let app =
  admin.apps.length == 0
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
      })
    : admin.apps[0];

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
async function credValidityCheck({ type, username, email, password }) {
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
  const result = await getAuth(app)
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

//change password
export async function changePassword({ token, currentPassword, newPassword }) {
  let user_id;
  let tokenResult = await tokenVerify({ token });

  if (tokenResult.status == 200) {
    user_id = tokenResult.id;
  } else {
    return {
      status: 500,
      message: "Token is invalid",
      error:
        "This error means that your session is invalid or expired, try signing out anad signing in again",
    };
  }

  if (
    !passwordRegex.test(currentPassword) ||
    !passwordRegex.test(newPassword)
  ) {
    return {
      status: 500,
      message:
        "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters.",
      error:
        "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters.",
    };
  }

  const result = await User.findOne({ _id: user_id })
    .then(async (user) => {
      if (user.google_auth) {
        return {
          status: 500,
          message:
            "You can't change the password of an account created using Google account",
          error:
            "Since you've used Google account to create your account, you can't change the password.",
        };
      }

      let passCheckResult = await new Promise((resolve, reject) => {
        bcrypt.compare(
          currentPassword,
          user.personal_info.password,
          async (err, result) => {
            if (err) {
              resolve({
                status: 500,
                message: "Error occured while checking the current password.",
                error:
                  "It seems like our service had faced some error while checking your password. ",
              });
            }

            if (!result) {
              resolve({
                status: 500,
                error: "You current password is wrong",
                message: "Your current password id wrong.",
              });
            }

            bcrypt.hash(newPassword, 10, (err, hashedPass) => {
              User.findOneAndUpdate(
                { _id: user_id },
                { "personal_info.password": hashedPass }
              )
                .then((user) => {
                  resolve({ status: 200, message: "Password is changed" });
                })
                .catch((err) => {
                  resolve({
                    status: 500,
                    message:
                      "Error occurred while changing the password. Please, try again later",
                    error: err.message,
                  });
                });
            });
          }
        );
      });

      return passCheckResult;
    })
    .catch((err) => {
      return { status: 500, message: "User not found", error: err.message };
    });

  return result;
}

//update profile image
export async function updateProfileImage({ token, url }) {
  let user_id;

  let tokenResult = await tokenVerify({ token });

  if (tokenResult.status == 200) {
    user_id = tokenResult.id;
  } else {
    console.error(tokenResult);
    return {
      status: 500,
      message: "Token is invalid",
      error:
        "This error means that your session is invalid or expired, try signing out anad signing in again",
    };
  }

  const result = await User.findOneAndUpdate(
    { _id: user_id },
    { "personal_info.profile_img": url }
  )
    .then(() => {
      return {
        status: 200,
        message: "Profile image is updated",
        profile_img: url,
      };
    })
    .catch((err) => {
      return {
        status: 500,
        message: "Error occurred while updating the image",
        error: err.message,
      };
    });

  return result;
}

//update profile
export async function updateProfile({ token, username, bio, social_links }) {
  let user_id;

  let tokenResult = await tokenVerify({ token });

  if (tokenResult.status == 200) {
    user_id = tokenResult.id;
  } else {
    console.error(tokenResult);
    return {
      status: 500,
      message: "Token is invalid",
      error:
        "This error means that your session is invalid or expired, try signing out anad signing in again",
    };
  }

  if (!username.length || username.length < 4) {
    return {
      status: "500",
      message: "Enter username with a minimum of 4 characters to continue.",
      error: "Enter username with a minimum of 4 characters to continue.",
    };
  }

  if (bio.length > 150) {
    return {
      status: "500",
      message: "Bio should not contain more than 150 character",
      error: "Bio should not contain more than 150 character",
    };
  }

  let socialLinksArr = Object.keys(social_links);

  try {
    for (let i = 0; i < socialLinksArr.length; i++) {
      if (social_links[socialLinksArr[i]].length) {
        let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          return {
            status: 500,
            message: `${socialLinksArr[i]} link is invalid`,
            error:
              "Invalid links are provided as input for social links field.",
          };
        }
      }
    }
  } catch (err) {
    return {
      status: 500,
      message: "You must provide full social links with 'https' included.",
      error: "You must provide full social links with 'https' included.",
    };
  }

  let updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  const result = await User.findOneAndUpdate({ _id: user_id }, updateObj, {
    runValidators: true,
  })
    .then((response) => {
      return { status: 200, username };
    })
    .catch((err) => {
      if (err.code == 11000) {
        return {
          status: 500,
          message: "Username is already taken",
          error: err.message,
        };
      } else {
        return {
          status: 500,
          message: "Error occurred while updating the profile",
          error: err.message,
        };
      }
    });

  return result;
}
