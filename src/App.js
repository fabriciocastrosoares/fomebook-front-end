import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import NewPost from "./pages/NewPost/NewPost";
import MyFollowersPage from "./pages/MyFollowers/MyFollowers";
import AnotherUsersProfile from "./pages/AnotherUsersProfile/AnotherUsersProfile";
import FollowingPage from "./pages/MyFollowers/FollowingPage";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";
import SigninPage from "./pages/registrationAndLogin/SigninPage";
import SignupPage from "./pages/registrationAndLogin/SignupPage";
import TimeLine from "./pages/timeline/TimeLine";

export default function App() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [image, setImage] = useState(localStorage.getItem("image"));
  return (
    <>
      <UserContext.Provider value={{ name, setName, token, setToken, image, setImage }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SigninPage />} />
            <Route path="/signup-page" element={<SignupPage />} />
            <Route path="time-line" element={<TimeLine />} />
            <Route path="/home-page" element={<HomePage />} />
            <Route path="/new-post" element={<NewPost />} />
            <Route path="/my-followers" element={<MyFollowersPage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/users/:id" element={<AnotherUsersProfile />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider >
    </>
  );
};