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

  const iconClasses = "absolute z-10 left-4 bottom-0 ";
  return (
    <div className="relative flex z-0 items-center justify-center">
      {icon === "user" && (
        <UserIcon
          className={iconClasses + "w-[1.5rem] bottom-1 -translate-y-2"}
        />
      )}
      {icon === "email" && (
        <EnvelopeIcon
          className={iconClasses + "w-[1.5rem] bottom-1 -translate-y-2"}
        />
      )}
      {icon === "key" && (
        <KeyIcon
          className={iconClasses + "w-[1.5rem] bottom-1 -translate-y-2"}
        />
      )}
      {icon === "fa" && (
        <i
          className={
            iconClasses + iconVal + " text-2xl -translate-y-2 text-gunmetal "
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
          "peer/input border-none pl-12 input-box w-full font-montserrat font-normal text-md h-[55px] bg-grey/50 p-4 rounded-md outline-none selection:bg-rose-quartz outline-rose-quartz/30 focus:outline-rose-quartz focus:bg-grey placeholder:text-dark-grey text-black duration-300 mt-6 " +
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
