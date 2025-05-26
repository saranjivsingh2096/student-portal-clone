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

  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student/profile`,
    ['studentProfile']
  );

  const {
    data: internalMarks,
    isLoading: isLoadingMarks,
    isError: isErrorMarks,
    error: errorMarks,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student/internal-marks`,
    ['internalMarks']
  );

  // Overall loading state for the page content (profile OR marks)
  const pageIsLoading = isLoadingProfile || isLoadingMarks;
  // Overall error state for the page content (profile OR marks)
  const pageIsError = isErrorProfile || isErrorMarks;
  // Combined error message for page content (prefer profile error if both, or specific logic)
  const pageError = errorProfile || errorMarks;

  if (pageIsLoading) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={studentProfile}
          isLoadingProfile={isLoadingProfile} 
          isErrorProfile={isErrorProfile} 
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

  if (pageIsError) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={studentProfile}
          isLoadingProfile={isLoadingProfile} 
          isErrorProfile={isErrorProfile} 
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
              <p>Error loading data: {pageError?.message || 'Unknown error'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check for empty data after loading and no errors
  if (!studentProfile || !internalMarks || internalMarks.length === 0) {
    return (
      <div>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          studentProfile={studentProfile} 
          isLoadingProfile={isLoadingProfile} 
          isErrorProfile={isErrorProfile}
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
              <p>No internal marks data found or profile is missing.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const marksData = internalMarks.markDetails || [];

  return (
    <div>
      <Navbar 
        toggleSidebar={toggleSidebar} 
        studentProfile={studentProfile} 
        isLoadingProfile={isLoadingProfile} 
        isErrorProfile={isErrorProfile}
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
                  isLoading={isLoadingMarks}
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
