"use client";

import Logo from "@/components/Logo/Logo";
import Image from "next/image";
import maria from "@/public/maria_back.jpg";
import Input from "@/components/signMethod/Input";
import google from "@/public/google.svg";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { credValidityCheck } from "@/server/serverActions";
import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "@/common/session";
import { UserContext } from "@/common/ContextProvider";
import { useRouter } from "next/navigation";
import { authWithGoogle } from "@/common/firebase";

function page({ params }) {
  const router = useRouter();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  console.log(access_token);

  const [userCred, setUSerCreds] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function signHandler(type = params.signMethod) {
    const credResult = await credValidityCheck(
      (type = params.signMethod),
      userCred.username ? (username = userCred.username) : "none",
      (email = userCred.email),
      (password = userCred.password)
    );

    if (credResult.status != 200) console.log(credResult);

    if (credResult.status == "befSub") {
      if (credResult.error == "username") {
        toast.error(
          "Enter username with a minimum of 4 characters to continue."
        );
      }

      if (credResult.error == "email") {
        toast.error("Email is invalid.");
      }
      if (credResult.error == "password") {
        toast.error(
          "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters."
        );
      }
    }

    if (credResult.status == 403) {
      toast.error("Email already exists.");
    }

    //signin errors
    if (credResult.status == 404) {
      toast.error("Email not found.");
    }

    if (credResult.status == 405) {
      toast.error("Password is wrong");
    }

    if (credResult.status == 500) {
      toast.error("Sorry, an error occurred on our end");
      console.log(credResult.error);
    }

    //success
    if (credResult.status == 200) {
      toast.success("Success");
      storeInSession("user", JSON.stringify(credResult));
      setUserAuth(credResult);
    }
  }

  access_token && router.push("/");

  function handleGoogleAuth(e) {
    e.preventDefault();
    authWithGoogle()
      .then((user) => console.log(user))
      .catch((err) => {
        toast.error("Trouble logging through google");
        return console.log(err);
      });
  }
  return (
    <AnimationWrapper className="h-full">
      <div className="flex h-full w-full">
        <Toaster />
        <a href="/">
          <Logo className="absolute mt-[10px] ml-[10px] md:mt-[1vh] md:ml-[2vw]" />
        </a>
        <div className="w-full md:w-[45vw] h-full flex items-center justify-center md:items-start">
          <form className="md:mt-[25vh] w-[80%] max-w-[400px] md:max-w-[450px]">
            <h2 className="font-rale">
              {params.signMethod === "signin" ? "WELCOME" : "JOIN US TODAY!"}
            </h2>
            {params.signMethod === "signup" && (
              <Input
                type="text"
                placeholder="Username"
                name="username"
                id="username"
                icon="user"
                onChange={(e) => {
                  setUSerCreds((curVal) => {
                    return { ...curVal, username: e.target.value };
                  });
                }}
              />
            )}
            <Input
              type="text"
              placeholder="Email"
              name="email"
              id="email"
              icon="email"
              onChange={(e) => {
                setUSerCreds((curVal) => {
                  return { ...curVal, email: e.target.value };
                });
              }}
            />
            <Input
              type="password"
              placeholder="password"
              name="password"
              id="password"
              icon="key"
              onChange={(e) => {
                setUSerCreds((curVal) => {
                  return { ...curVal, password: e.target.value };
                });
              }}
            />
            <button
              className="btn-dark center mt-12 py-3 hover:bg-gunmetal-2/60 hover:text-black outline-none hover:outline-french-gray duration-150"
              onClick={(e) => {
                e.preventDefault();
                signHandler();
              }}
            >
              {params.signMethod == "signin" ? "Sign In" : "Sign Up"}
            </button>

            <div className="relative items-center flex w-full gap-2 my-10 opacity-30 uppercase text-black font-semibold font-montserrat">
              <hr className="w-1/2 border-black" />
              or
              <hr className="w-1/2 border-black" />
            </div>

            <button
              className="center outline-none hover:outline-french-gray hover:bg-gunmetal-2/60 duration-200 text-md font-poppins relative btn-dark w-[90%]"
              onClick={handleGoogleAuth}
            >
              <Image
                src={google}
                className="w-[1.5rem] object-fill absolute bottom-0"
              />
              <span className="mx-9">Continue with Google</span>
            </button>

            {params.signMethod == "signin" ? (
              <p className="mt-8 text-center w-full text-black">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-gunmetal hover:underline duration-200 hover:text-black"
                >
                  Join us today!
                </a>{" "}
              </p>
            ) : (
              <p className="mt-8 text-center w-full text-black">
                Already a user?{" "}
                <a
                  href="/signin"
                  className="text-gunmetal hover:underline duration-200 hover:text-black"
                >
                  Sign In.
                </a>{" "}
              </p>
            )}
          </form>
        </div>
        <div className="hidden md:block md:w-[55vw] h-full">
          <Image src={maria} alt="maria flower image" />
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default page;
