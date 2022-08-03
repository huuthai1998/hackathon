import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import validator from "validator";
import axios from "axios";
import SignInPhoto from "../assets/undraw-upload-re-pasx@3x.png";
import { notification } from "antd";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import InputBox from "../components/InputBox";
import { useAuthContext } from "../contexts/authStore";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const { setToken, authContext } = useAuthContext();

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    setInfo({ ...info, [name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleLogin = async () => {
    try {
      if (!info.email) throw new Error("Please inpput your email");
      if (!validator.isEmail(info.email)) throw new Error("Invalid email");
      if (!info.password) throw new Error("Please inpput your password");
      const { data } = await axios.post("/user/login", {
        email: info.email,
        password: info.password,
      });
      setToken(data.token);
      axios.defaults.headers.common.authorization = `Bearer ${data.token}`;
      return true;
    } catch (err) {
      notification.error({
        message: err.response?.data?.message || err.message,
        placement: "top",
      });
      return false;
    }
  };

  useEffect(() => {
    if (loading) {
      // setTimeout(() => {
      setLoading(false);
      const loginStatus = handleLogin();
      if (loginStatus === true) navigate("/builder");
      // }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (authContext.token.length > 0) navigate("/builder");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.token]);

  return (
    <div>
      {loading && <Spinner />}
      <div className="flex h-screen w-screen">
        <div className="w-[60%] bg-[#f5f8ff] pt-24">
          <h1 className="font-sans font-bold text-center mb-10 text-3xl">
            Design APIs fast,<br></br> Manage content easily.
          </h1>
          <img src={SignInPhoto} alt="sign in" className="" />
        </div>
        <form
          action="submit"
          className="p-8 pt-24 loginBox flex-1 bg-[#272727]"
        >
          <h1 className="font-sans font-bold text-center mb-10 text-3xl text-white">
            Login to your CMS+ account
          </h1>
          <InputBox
            name="email"
            placeholder="Email"
            icon={faEnvelope}
            onChangeHandler={onChangeHandler}
          />
          <InputBox
            type="password"
            name="password"
            placeholder="Password"
            icon={faLock}
            onChangeHandler={onChangeHandler}
          />
          <button
            onClick={submitHandler}
            className="loginButton w-full py-3 px-7 mt-2 rounded-md text-xl font-semibold text-lg bg-xred hover:bg-red-500 text-white"
          >
            Log in
          </button>
          <Link to={"/signUp"}>Create a new account </Link>
        </form>
      </div>
    </div>
  );
}
