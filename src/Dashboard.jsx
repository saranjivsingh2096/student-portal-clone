import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import useFetchData from "./utils/useFetchData";
import { ProfileCard } from "./components/ProfileCard";

const Dashboard = () => {
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

  const { 
    data: studentProfile, 
    isLoading, 
    isError, 
    error 
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student/profile`,
    ['studentProfile']
  );

  if (isLoading) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={undefined} 
          isLoadingProfile={true} 
          isErrorProfile={false} 
        />
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

  if (isError) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={undefined} 
          isLoadingProfile={false} 
          isErrorProfile={true} 
        />
        <div
          id="layoutSidenav"
          className={`d-flex flex-grow-1 ${
            isSidebarOpen ? "" : "sidenav-closed"
          }`}
        >
          <div id="layoutSidenav_nav">
            <SidebarMenu studentProfile={undefined} />
          </div>

          <div id="layoutSidenav_content" className="flex-grow-1">
            <div className="container mt-4 text-center">
              <p>Error loading profile: {error?.message || 'Unknown error'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studentProfile || (Array.isArray(studentProfile) && studentProfile.length === 0)) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={studentProfile} 
          isLoadingProfile={false} 
          isErrorProfile={false}
        />
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
            <div className="container mt-4 text-center">
              <img src="./images/empty.png" alt="No data" style={{height: '50px'}} /> 
              <p>No profile data found, or profile is empty.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileData = {
    "Student Name": studentProfile?.studentName,
    "Student ID": studentProfile?.studentId,
    "Register No.": studentProfile?.registerNo,
    "Email ID": studentProfile?.email,
    Institution: studentProfile?.institution,
    Program: studentProfile?.program,
  };

  return (
    <div>
      <Navbar 
        toggleSidebar={toggleSidebar} 
        studentProfile={studentProfile} 
        isLoadingProfile={isLoading} 
        isErrorProfile={isError}
      />
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
            <div className="row">
              <div className="col-md-8">
                <ProfileCard
                  title="Student Profile"
                  data={profileData}
                  icon="fa fa-user"
                />
              </div>
              <div className="col-md-4">
                <div className="card border-custom mb-4">
                  <div className="card-body text-center">
                    <div id="divImage">
                      <img
                        className="img-account-profile mb-2 imgPhoto"
                        src={studentProfile?.photoUrl}
                        style={{
                          borderRadius: "50%",
                          width: "150px",
                          height: "150px",
                        }}
                        alt=""
                      />
                    </div>
                    <div className="large font-weight-bold text-custom text-center mb-4">
                      Current Status: {studentProfile?.status}
                    </div>
                    <div>
                      <img
                        src="./images/refresh.png"
                        alt="Refresh"
                        style={{
                          cursor: "pointer",
                          height: "30px",
                          width: "30px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
