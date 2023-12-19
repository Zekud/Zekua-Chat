import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import Chats from "../components/Chats";
function sideBar() {
  return (
    <div className="sidebar">
      <NavBar />
      <Search />
      <Chats />
    </div>
  );
}

export default sideBar;
