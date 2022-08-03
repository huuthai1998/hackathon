import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Avatar from "../assets/avatar.jpeg";
import { notification } from "antd";

import { useAuthContext } from "../contexts/authStore";
import Spinner from "../components/Spinner";

const InputAccount = ({
  type,
  defaultValue,
  buttonName,
  buttonAction,
  disabled,
  className,
  name,
  label,
  placeholder,
  onChangeHandler,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className={`font-bold mb-2`}>
          {label}
        </label>
      )}
      <div className="flex w-full h-12 mb-5">
        <input
          defaultValue={defaultValue}
          disabled={disabled}
          type={type || "text"}
          className={`${className} h-full w-[500px] border items-center  rounded-md font-medium text-base px-4 py-2`}
          name={name}
          placeholder={placeholder}
          onChange={onChangeHandler}
        />
        {buttonName && (
          <button
            onClick={buttonAction}
            className="ml-5 w-64 font-semibold bg-[#EEEEEE] border-[#EEEEEE] border rounded-md h-full"
          >
            {buttonName}
          </button>
        )}
      </div>
    </div>
  );
};

const OPTIONS = {
  CHANGE_AVATAR: "CHANGE_AVATAR",
  CHANGE_USERNAME: "CHANGE_USERNAME",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  REMOVE_AVATAR: "REMOVE_AVATAR",
};

export default function AccountPage() {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [option, setOption] = useState("");

  const { authContext, setUser } = useAuthContext();

  const uploadImgButton = createRef(null);
  const storage = getStorage();

  useEffect(() => {
    if (!authContext.token && !Cookies.get("token")) navigate("/welcome");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.token]);

  useEffect(() => {
    setInfo({ ...info, ...authContext.user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.user]);

  const onInputChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setInfo({ ...info, [name]: value });
  };

  const changeUsername = async () => {
    try {
      await axios.put("/user", { username: info.username });
      notification.info({
        message: "Successfully changed your user name",
        placement: "top",
        duration: 2,
      });
      setUser({ ...authContext.user, username: info.username });
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
    }
  };

  const changePassword = async () => {
    try {
      if (info.password?.length === 0 || info.newPassword?.length === 0)
        throw new Error("Please input your passwords");
      if (info.confirmPassword !== info.newPassword)
        throw new Error("Passwords don't match");
      await axios.put("/user", {
        oldPassword: info.password,
        newPassword: info.newPassword,
      });
      notification.info({
        message: "Successfully changed your password",
        placement: "top",
        duration: 2,
      });
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
    }
  };

  const changeAvatar = async () => {
    try {
      const storageRef = ref(storage, imageFile.name);
      await uploadBytes(storageRef, imageFile);
      const uploaderUrl = await getDownloadURL(ref(storage, imageFile.name));
      await axios.put("/user", { avatar: uploaderUrl });
      setUser({ ...authContext.user, avatar: uploaderUrl });
      notification.info({
        message: "Successfully updated avatar",
        placement: "top",
      });
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
    }
  };

  const removeAvatar = async () => {
    try {
      await axios.put("/user", { avatar: " " });
      setUser({ ...authContext.user, avatar: " " });
      notification.info({
        message: "Successfully removed avatar",
        placement: "top",
      });
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
    }
  };

  const submitHandler = (event, opt) => {
    event.preventDefault();
    if (opt === OPTIONS.CHANGE_AVATAR && event.target?.files?.[0]) {
      setImageFile(event.target.files[0]);
    }
    setOption(opt);
    setLoading(true);
  };

  const handleOption = async () => {
    if (loading) {
      switch (option) {
        case OPTIONS.CHANGE_AVATAR:
          await changeAvatar();
          break;
        case OPTIONS.CHANGE_USERNAME:
          await changeUsername();
          break;
        case OPTIONS.CHANGE_PASSWORD:
          await changePassword();
          break;
        case OPTIONS.REMOVE_AVATAR:
          await removeAvatar();
          break;
        default:
          console.log("nothing change");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    handleOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className="h-screen w-screen p-10">
      {loading && <Spinner />}
      <h1 className="font-semibold text-3xl mb-10">Your account</h1>
      <div className="flex items-center mb-10">
        <div className="rounded-full h-24 w-24 mr-6">
          <img
            src={
              authContext.user.avatar?.length > 1
                ? authContext.user.avatar
                : Avatar
            }
            alt="User Avatar"
            className="rounded-full h-24 w-24 object-cover"
          />
        </div>
        <input
          ref={uploadImgButton}
          style={{ display: "none" }}
          type="file"
          name="myImage"
          onChange={(event) => submitHandler(event, OPTIONS.CHANGE_AVATAR)}
        />
        <button
          onClick={() => uploadImgButton.current.click()}
          className="font-semibold bg-[#EEEEEE] border-[#EEEEEE] border-2 rounded-md py-1 px-2 mr-5"
        >
          Change avatar
        </button>
        <button
          className="font-semibold border-xred border rounded-md px-2 py-1 text-xred"
          onClick={(event) => submitHandler(event, OPTIONS.REMOVE_AVATAR)}
        >
          Remove avatar
        </button>
      </div>
      <InputAccount
        defaultValue={info.username}
        buttonAction={(event) => submitHandler(event, OPTIONS.CHANGE_USERNAME)}
        buttonName={"Update"}
        name="username"
        placeholder={"User name"}
        label={"User name"}
        onChangeHandler={onInputChangeHandler}
      />
      <InputAccount
        defaultValue={info.email}
        disabled={true}
        className="bg-gray-200 disabled"
        name="email"
        placeholder={"Email"}
        label={"Email"}
      />
      <InputAccount
        type="password"
        name="password"
        placeholder={"Current password"}
        label={"Password"}
        onChangeHandler={onInputChangeHandler}
      />
      <InputAccount
        type="password"
        name="newPassword"
        placeholder={"New password"}
        onChangeHandler={onInputChangeHandler}
      />
      <InputAccount
        type="password"
        name="confirmPassword"
        placeholder={"Confirm new password"}
        onChangeHandler={onInputChangeHandler}
        buttonAction={(event) => submitHandler(event, OPTIONS.CHANGE_PASSWORD)}
        buttonName={"Change password"}
      />
    </div>
  );
}
