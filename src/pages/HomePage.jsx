import React from "react";
import SideBar from "../components/SideBar";
import Chat from "../components/Chat";
function HomePage() {
  return (
    <div className="home">
      <SideBar />
      <Chat />
    </div>
  );
}

export default HomePage;
