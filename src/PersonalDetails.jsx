import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import { ProfileCard } from "./components/ProfileCard";
import useFetchData from "./utils/useFetchData";

const PersonalDetails = () => {
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

  if (!studentProfile || studentProfile.length === 0) {
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

        {/* Main Content */}
        <div id="layoutSidenav_content" className="flex-grow-1">
          <div className="container mt-4">
            {/* General Details */}
            <ProfileCard
              title="General Details"
              data={{
                "Student Name": studentProfile?.studentName,
                "Register No.": studentProfile?.registerNo,
                Institution: studentProfile?.institution,
                Program: studentProfile?.program,
                Batch: studentProfile?.batch,
                Semester: studentProfile?.semester,
                Section: studentProfile?.section,
              }}
            />

            {/* Personal Details */}
            <ProfileCard
              title="Personal Details"
              data={{
                "Date of Birth": studentProfile?.dob,
                Gender: studentProfile?.gender,
                Nationality: studentProfile?.nationality,
                "Blood Group": studentProfile?.bloodGroup,
              }}
            />

            {/* Parent Details */}
            <ProfileCard
              title="Parent Details"
              data={{
                "Father Name": studentProfile?.fatherName,
                "Mother Name": studentProfile?.motherName,
                "Parent Contact No.": studentProfile?.parentContact,
                "Parent Email ID": studentProfile?.parentEmail,
              }}
            />

            {/* Address for Communication */}
            <ProfileCard
              title="Address for Communication"
              data={{
                Address: studentProfile?.address,
                Pincode: studentProfile?.pincode,
                District: studentProfile?.district,
                State: studentProfile?.state,
                "Personal Email ID": studentProfile?.personalEmail,
                "Student Mobile No.": studentProfile?.studentMobile,
                "Alternative Student Mobile No.":
                  studentProfile?.alternativeStudentMobile,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
