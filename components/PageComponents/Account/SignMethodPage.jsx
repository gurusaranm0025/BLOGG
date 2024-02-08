"use client";

import Logo from "@/components/Logo/Logo";
import Image from "next/image";
import maria from "@/public/maria_back.jpg";
import Input from "@/components/signMethod/Input";
import google from "@/public/google.svg";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { storeInSession } from "@/common/session";
import { ThemeContext, UserContext } from "@/common/ContextProvider";
import { useRouter } from "next/navigation";
import { authWithGoogle } from "@/common/firebase";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import axios from "axios";

//regex
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

function SignMethodPage({ params }) {
  const router = useRouter();

  let { theme, setTheme } = useContext(ThemeContext);

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const authForm = useRef();

  async function signHandler(type = params.signMethod) {
    let form = new FormData(authForm.current);

    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { username, email, password } = formData;

    if (type == "signup") {
      if (!username.length || username.length < 4) {
        return toast.error(
          "Enter username with a minimum of 4 characters to continue."
        );
      }
    }

    if (!email.length || !emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!password.length || !passwordRegex.test(password)) {
      return toast.error(
        "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters."
      );
    }

    formData["type"] = params.signMethod;

    console.log("formdata =>", formData);

    axios
      .post(
        process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/credValidityCheck",
        formData
      )
      .then(({ data }) => {
        console.log("data => ", data);

        if (data.status == 500) {
          console.log(data);
          toast.error("Sorry, an error occurred on our end");
          console.log(data.error);
        }

        //success
        if (data.status === 200) {
          toast.success("Success");
          storeInSession("user", JSON.stringify(data));
          setUserAuth(data);
        } else {
          toast.error(data.error);
        }
      })
      .catch((response) => {
        console.log("response =>", response);
        toast.error("Trouble signing....");
      });
  }

  function handleGoogleAuth(e) {
    e.preventDefault();
    authWithGoogle()
      .then(async (user) => {
        axios
          .post(process.env.NEXT_PUBLIC_SERVER_DOMAIN + "/googleAuth", {
            access_token: user.accessToken,
          })
          .then(({ data }) => {
            if (data.status === 200) {
              storeInSession("user", JSON.stringify(data));
              setUserAuth(data);
            } else {
              toast.error(data.error);
            }
          });
      })
      .catch((err) => {
        toast.error("Trouble logging through google");
        return console.log(err);
      });
  }

  function changeTheme() {
    let newTheme = theme == "dark" ? "light" : "dark";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    storeInSession("theme", newTheme);
  }
  return (
    <>
      {access_token ? (
        router.push("/")
      ) : (
        <AnimationWrapper className="h-full w-full">
          <div className="relative backdrop:filter-white/60 flex h-full w-full z-10">
            <button
              className="absolute right-0 top-3 mr-5 outline-none hover:outline-rose-quartz/70 w-12 h-12 bg-grey/75 rounded-full hover:bg-rose-quartz/50 duration-300"
              onClick={changeTheme}
            >
              {theme == "dark" ? (
                <SunIcon className="w-[1.5rem] block mx-auto my-auto" />
              ) : (
                <MoonIcon className="w-[1.5rem] block mx-auto my-auto" />
              )}
            </button>

            <Toaster />

            <div className="w-full md:w-[45vw] h-full flex flex-1 items-center justify-center md:items-start">
              <form
                ref={authForm}
                className="md:mt-[17vh] w-[85%] max-w-[500px] md:max-w-[450px] bg-white/75 outline-none outline-white/40 p-5 py-10 rounded-lg shadow-2xl shadow-black/60"
              >
                <a href="/">
                  <Logo />
                </a>
                <h2 className="font-rale">
                  {params.signMethod === "signin"
                    ? "WELCOME"
                    : "JOIN US TODAY!"}
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
                  className="btn-dark center mt-12 py-3 hover:text-black outline-none hover:outline-rose-quartz/80"
                  onClick={(e) => {
                    e.preventDefault();
                    signHandler();
                  }}
                >
                  {params.signMethod == "signin" ? "Sign In" : "Sign Up"}
                </button>

                <div className="relative items-center flex w-full gap-2 my-10 opacity-30 uppercase text-gunmetal font-semibold font-rale">
                  <hr className="w-1/2 border-black" />
                  or
                  <hr className="w-1/2 border-black" />
                </div>

                <button
                  className="center outline-none hover:outline-rose-quartz/80 text-md font-poppins relative btn-dark w-[90%]"
                  onClick={handleGoogleAuth}
                >
                  <Image
                    src={google}
                    className="w-[1.5rem] object-fill absolute bottom-0"
                    alt="Google-icon"
                  />
                  <span className="mx-9">Continue with Google</span>
                </button>

                {params.signMethod == "signin" ? (
                  <p className="mt-8 text-center w-full text-black">
                    Don't have an account?{" "}
                    <a
                      href="/account/signup"
                      className="text-gunmetal hover:underline duration-300 hover:text-black"
                    >
                      Join us today!
                    </a>{" "}
                  </p>
                ) : (
                  <p className="mt-8 text-center w-full text-black">
                    Already a user?{" "}
                    <a
                      href="/account/signin"
                      className="text-gunmetal hover:underline duration-300 hover:text-black"
                    >
                      Sign In.
                    </a>
                  </p>
                )}
              </form>
            </div>

            <div className="absolute -z-10 bg-transparent w-full h-full ">
              <div className="relative w-full h-full">
                <Image
                  src={maria}
                  className="absolute top-0 -z-20 left-0 h-full object-cover"
                  alt="maria flower image"
                />
                <div className="backdrop-blur-md w-full h-full duration-300"></div>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      )}
    </>
  );
}

export default SignMethodPage;
