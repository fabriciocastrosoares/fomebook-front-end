import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage/HomePage";
import NewPost from "./pages/NewPost/NewPost";
import MyFollowersPage from "./pages/MyFollowers/MyFollowers";
import AnotherUsersProfile from "./pages/AnotherUsersProfile/AnotherUsersProfile";
import FollowingPage from "./pages/MyFollowers/FollowingPage";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";

export default function App() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <>
      <UserContext.Provider value={{ name, setName, token, setToken }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SigninPage />} />
            <Route path="/signup-page" element={<SignupPage />} />
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