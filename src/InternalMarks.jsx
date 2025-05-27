import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import useFetchData from "./utils/useFetchData";
import Table from "./components/Table";

const InternalMarks = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

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
            <div className="container mt-4">
              <div className="card mb-3">
                <div className="card-header bg-custom text-white">
                  Internal Mark Details
                </div>
                <div className="card-body">
                  <Table
                    columns={[
                      { title: "Code", key: "code", width: "15%" },
                      { title: "Description", key: "description", width: "30%" },
                      { title: "Mark / Max. Mark", key: "marks", width: "15%" },
                      { title: "", key: "viewDetails", width: "5%" },
                    ]}
                    data={[]}
                    isLoading={false}
                  />
                </div>
              </div>
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
            <div className="container mt-4">
              <div className="card mb-3">
                <div className="card-header bg-custom text-white">
                  Internal Mark Details
                </div>
                <div className="card-body">
                  <Table
                    columns={[
                      { title: "Code", key: "code", width: "15%" },
                      { title: "Description", key: "description", width: "30%" },
                      { title: "Mark / Max. Mark", key: "marks", width: "15%" },
                      { title: "", key: "viewDetails", width: "5%" },
                    ]}
                    data={[]}
                    isLoading={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const marksData = internalMarks.markDetails || [];

  // Helper to calculate total and max marks for a subject (from assessments)
  const getTotalMarks = (assessments) => {
    if (!Array.isArray(assessments)) return { total: 0, max: 0 };
    return assessments.reduce(
      (acc, a) => {
        // marks is a string like "5.00 / 5.00"
        const [mark, max] = (a.marks || "0/0").split("/").map(s => parseFloat(s.trim()) || 0);
        return { total: acc.total + mark, max: acc.max + max };
      },
      { total: 0, max: 0 }
    );
  };

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
                    { title: "Description", key: "description", width: "30%" },
                    { title: "Mark / Max. Mark", key: "marks", width: "15%" },
                    { title: "", key: "viewDetails", width: "5%" },
                  ]}
                  data={marksData.map((mark) => {
                    const { total, max } = getTotalMarks(mark.assessments);
                    return {
                      code: mark.code,
                      description: mark.description,
                      marks: `${total.toFixed(2)} / ${max.toFixed(2)}`,
                      viewDetails: (
                        <button
                          className="btn btn-sm btn-custom lift"
                          onClick={() => {
                            setSelectedSubject(mark);
                            setShowModal(true);
                          }}
                        >
                          <i className="fa fa-eye px-1 py-1"></i> View Details
                        </button>
                      ),
                    };
                  })}
                  isLoading={isLoadingMarks}
                />
              </div>
            </div>

            {/* Modal for subject details */}
            {showModal && selectedSubject && (
              <div
                className="modal fade show"
                tabIndex="-1"
                style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                aria-modal="true"
                role="dialog"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header bg-custom text-white">
                      <h5 className="modal-title text-white">
                        {selectedSubject.code} - {selectedSubject.description}
                      </h5>
                      <button
                        type="button"
                        className="close text-white"
                        onClick={() => setShowModal(false)}
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="table-responsive table-billing-history">
                        <table className="table mb-0">
                          <thead>
                            <tr>
                              <th width="25%">Entered on</th>
                              <th width="25%">Component</th>
                              <th width="30%">Mark / Max. Mark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSubject.assessments && selectedSubject.assessments.map((a, idx) => (
                              <tr key={idx}>
                                <td>{a.date || "-"}</td>
                                <td>{a.component || "-"}</td>
                                <td>{a.marks || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-dark lift"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalMarks;
