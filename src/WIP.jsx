import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import useFetchData from "./utils/useFetchData";

const WIP = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-toggled", "sidenav-toggled");
    } else {
      document.body.classList.remove("sidebar-toggled", "sidenav-toggled");
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { data: studentProfile } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`
  );

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <div
        id="layoutSidenav"
        className={`d-flex flex-grow-1 ${
          isSidebarOpen ? "" : "sidenav-closed"
        }`}
      >
        <div id="layoutSidenav_nav">
          <SidebarMenu studentProfile={studentProfile} />
        </div>

        <div id="layoutSidenav_content" className="flex-grow-1">
          <div className="container mt-4">
            <div>
              <img
                src="https://sp.srmist.edu.in/srmiststudentportal/resources/Image/wait.gif"
                alt="Loading..."
              />
              <p>Please wait...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WIP;
