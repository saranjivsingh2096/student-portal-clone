import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import useFetchData from "./utils/useFetchData";
import Table from "./components/Table";

const InternalMarks = () => {
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

  const { data: internalMarks } = useFetchData(
    `${process.env.REACT_APP_API_URL}/internal-marks`
  );

  console.log("markDetails:", internalMarks);
  if (
    !studentProfile ||
    studentProfile.length === 0 ||
    !internalMarks ||
    internalMarks.length === 0
  ) {
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
                <img src="./images/wait.gif" alt="Loading..." />
                <p>Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const marksData = internalMarks.markDetails || [];

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
            <div className="card mb-3">
              <div className="card-header bg-custom text-white">
                Internal Mark Details
              </div>
              <div className="card-body">
                <Table
                  columns={[
                    { title: "Code", key: "code", width: "15%" },
                    { title: "Description", key: "description", width: "15%" },
                    { title: "Mark / Max. Mark", key: "marks", width: "15%" },
                  ]}
                  data={marksData.map((mark) => ({
                    code: mark.code,
                    description: mark.description,
                    marks: mark.marks,
                  }))}
                  isLoading={!internalMarks}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalMarks;
