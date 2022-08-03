import { useEffect } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import ContentTypesPage from "./pages/ContentTypesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";
import WelcomePage from "./pages/WelcomePage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";
import { useAuthContext } from "./contexts/authStore";
import { TodoProvider } from "./contexts/todoStore";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import EntriesPage from "./pages/EntriesPage";

axios.defaults.baseURL = "http://localhost:5001/";
axios.defaults.headers.common.accept = "application/json";

const App = () => {
  const { authContext, setUser, setToken } = useAuthContext();

  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get("/user");
      setUser(data.user);
    } catch (err) {
      console.log(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common.authorization = `Bearer ${token}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authContext.token.length > 0) {
      axios.defaults.headers.common.authorization = `Bearer ${authContext.token}`;
      fetchUserInfo();
    }
  }, [authContext.token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/welcome"
          element={
            <div className="flex">
              <Sidebar />
              <NavBar />
              <WelcomePage />
            </div>
          }
        />
        <Route
          path="/builder"
          element={
            <TodoProvider>
              <div className="flex w-screen">
                <Sidebar />
                <div className="flex-1">
                  <NavBar />
                  <ContentTypesPage />
                </div>
              </div>
            </TodoProvider>
          }
        >
          <Route
            path=":id"
            element={
              <TodoProvider>
                <div className="flex w-screen">
                  <Sidebar />
                  <div className="flex-1">
                    <NavBar />
                    <ContentTypesPage />
                  </div>
                </div>
              </TodoProvider>
            }
          />
        </Route>
        <Route
          path="/entry/:id"
          element={
            <div className="flex w-screen">
              <Sidebar />
              <div className="flex-1">
                <NavBar />
                <EntriesPage />
              </div>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
