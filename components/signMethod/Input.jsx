"use client";

import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

function Input({
  type,
  placeholder,
  name,
  id,
  value,
  icon,
  iconVal,
  onChange,
  disabled = false,
}) {
  const [passVisibility, setPassVisibilty] = useState(false);

  function visibilityHandler() {
    setPassVisibilty((currVal) => !currVal);
  }

  const iconClasses =
    "absolute top-auto z-10 left-4 bottom-1 -translate-y-1/2 ";
  return (
    <div className="relative flex z-0 items-center">
      {icon === "user" && <UserIcon className={iconClasses + "w-[1.5rem]"} />}
      {icon === "email" && (
        <EnvelopeIcon className={iconClasses + "w-[1.5rem]"} />
      )}
      {icon === "key" && <KeyIcon className={iconClasses + "w-[1.5rem]"} />}
      {icon === "fa" && (
        <i
          className={
            iconClasses + iconVal + " text-xl top-auto -translate-y-3/4"
          }
        ></i>
      )}
      <input
        disabled={disabled}
        type={
          type == "password" ? (passVisibility ? "text" : "password") : "text"
        }
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={id}
        defaultValue={value}
        className={
          "pl-12 input-box w-full font-montserrat font-normal text-md h-[55px] bg-gunmetal/10 p-4 rounded-md outline-none selection:bg-rose-quartz focus:outline-rose-quartz/80 focus:bg-gray-300 placeholder:text-gray-800 text-black duration-200 mt-6 " +
          (type === "password" && "pr-12")
        }
      />
      {type === "password" &&
        (passVisibility ? (
          <EyeSlashIcon
            className="w-[1.5rem] absolute right-4 bottom-1 -translate-y-1/2"
            onClick={visibilityHandler}
          />
        ) : (
          <EyeIcon
            className="w-[1.5rem] absolute right-4 bottom-1 -translate-y-1/2"
            onClick={visibilityHandler}
          />
        ))}
    </div>
  );
}

export default Input;
