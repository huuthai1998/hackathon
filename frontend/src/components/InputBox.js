import React, { createRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

export default function InputBox({
  type,
  icon,
  placeholder,
  name,
  onChangeHandler,
}) {
  const inputRef = createRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const onShowPassword = () => {
    inputRef.current.type = showPassword ? "password" : "text";
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex border items-center mb-5 rounded-md">
      <FontAwesomeIcon icon={icon} className="ml-7 text-white" />
      <input
        ref={inputRef}
        type={type || " text"}
        name={name}
        onChange={onChangeHandler}
        className="ml-7 py-3 focus:outline-none flex-1 px-5 font-medium text-base"
        placeholder={placeholder}
        required={true}
      />
      {type && (
        <div className="items-center flex p-4">
          <FontAwesomeIcon
            onClick={onShowPassword}
            icon={!showPassword ? faEye : faEyeSlash}
            className="cursor-pointer text-white"
          />
        </div>
      )}
    </div>
  );
}
