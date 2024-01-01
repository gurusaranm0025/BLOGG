"use client";
import { UserContext } from "@/common/ContextProvider";
import AnimationWrapper from "@/components/pageAnimation/AnimationWrapper";
import Input from "@/components/signMethod/Input";
import { changePassword } from "@/server/signActions";
import { useContext, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

function page() {
  let changePassForm = useRef();
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();

    let form = new FormData(changePassForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { currentPassword, newPassword } = formData;
    console.log("CP : ", currentPassword);
    console.log("NP : ", newPassword);

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Fill all the inputs to continue");
    }

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "Password is invalid. Password must be 6 to 20 characters long with numbers and 1 lowercase and 1 uppercase letters."
      );
    }

    e.target.setAttribute("disabled", true);

    const loadingToast = toast.loading("Updating password...");

    changePassword({ token: access_token, currentPassword, newPassword })
      .then((response) => {
        toast.dismiss(loadingToast);

        if (response.status == 200) {
          return toast.success("Updated your password");
        } else {
          console.error(response.error);
          return toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.dismiss(loadingToast);
        console.log(err.message);
        return toast.error("Error occurred while changing password");
      });

    e.target.removeAttribute("disabled");
  }

  return (
    <AnimationWrapper>
      <Toaster />
      <form action="" ref={changePassForm}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <Input
            name="currentPassword"
            type="password"
            className="profile-edit-input"
            icon="key"
            placeholder="Current password..."
          />
          <Input
            name="newPassword"
            type="password"
            className="profile-edit-input"
            icon="key"
            placeholder="New password..."
          />

          <button
            className="btn-dark px-10 mt-5"
            type="submit"
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
}

export default page;
