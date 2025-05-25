import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import Table from "./components/Table";
import useFetchData from "./utils/useFetchData";

// Helper function to convert grade to points
const gradeToPoint = (grade) => {
  const gradeStr = String(grade).toUpperCase();
  if (gradeStr === "O") return 10;
  if (gradeStr === "A+") return 9;
  if (gradeStr === "A") return 8;
  if (gradeStr === "B+") return 7;
  if (gradeStr === "B") return 6;
  if (gradeStr === "C") return 5;
  if (["AB", "F", "W", "*", "FAIL", "ABSENT"].includes(gradeStr)) return 0; // Handle common fail/absent grades
  // Attempt to parse if it's already a number (e.g. for backlog papers where points might be directly given)
  const numericGrade = parseFloat(gradeStr);
  if (!isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 10) return numericGrade;
  return 0; // Default for unrecognized grades
};

// Helper function to calculate SGPA
const calculateSGPA = (courses) => {
  let totalPoints = 0;
  let totalCredits = 0;
  courses.forEach(course => {
    const credits = parseFloat(course.credit);
    if (!isNaN(credits) && credits > 0) { // Consider only courses with credits > 0 for SGPA denominator
      totalPoints += credits * gradeToPoint(course.grade);
      totalCredits += credits;
    }
  });
  if (totalCredits === 0) return "0.00";
  return (totalPoints / totalCredits).toFixed(2);
};

const Grade = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGradeDetailsModal, setShowGradeDetailsModal] = useState(false);

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
    error: errorProfile 
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`,
    ['studentProfile']
  );

  // Fetch Grade Data
  const {
    data: fetchedGradeData,
    isLoading: isLoadingGradesData,
    isError: isErrorGradesData,
    error: errorGradesData
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/grade-details`, // Replace with your actual grades endpoint
    ['studentGrades'] // Unique query key for React Query
  );

  const isLoadingGrades = isLoadingGradesData; // Use the loading state from the fetch hook
  const isLoadingCredits = false; // Placeholder - can be combined or use isLoadingGradesData if credits are part of grades

  const gradeColumns = [
    { title: "Semester", key: "semester", width: "10%" },
    { title: "Month / Year", key: "monthYear", width: "15%" },
    { title: "Code", key: "code", width: "15%" },
    { title: "Description", key: "description", width: "35%" },
    { title: "Credit", key: "credit", width: "10%" },
    { title: "Grade", key: "grade", width: "15%" },
  ];

  // --- Generalized Semester Data (Dummy) ---
  // In a real app, this would come from an API call for all grade details
  const rawSemestersData = useMemo(() => {
    // Use fetchedGradeData if available, otherwise default to an empty array
    // The structure from the API should match: { semesters: [ { semesterNumber: ..., courses: [...] } ] }
    // Or if the API directly returns the array of semesters: [ { semesterNumber: ..., courses: [...] } ]
    // For this example, I'm assuming the API directly returns the array of semester objects.
    // Adjust if your API returns it nested under a key like 'semesters'.
    return fetchedGradeData || [];
  }, [fetchedGradeData]);

  // --- Processed Academic Data with SGPAs ---
  const processedSemestersData = useMemo(() => {
    return rawSemestersData.map(sem => {
      const courses = sem.courses;
      let semesterTotalCredits = 0;
      courses.forEach(course => {
        const creditsVal = parseFloat(course.credit);
        if (!isNaN(creditsVal) && creditsVal > 0) {
          semesterTotalCredits += creditsVal;
        }
      });
      return {
        ...sem,
        sgpa: calculateSGPA(courses),
        semesterTotalCredits: semesterTotalCredits,
      };
    });
  }, [rawSemestersData]);

  // --- Dynamic CGPA Calculation ---
  const totalCGPA = useMemo(() => {
    let weightedSgpaSum = 0;
    let totalSemesterCreditsSum = 0;

    processedSemestersData.forEach(sem => {
      const si = sem.semesterTotalCredits;
      const sgpai = parseFloat(sem.sgpa);

      if (si > 0 && !isNaN(sgpai)) {
        weightedSgpaSum += si * sgpai;
        totalSemesterCreditsSum += si;
      }
    });

    const cgpaValue = totalSemesterCreditsSum === 0 ? "0.00" : (weightedSgpaSum / totalSemesterCreditsSum).toFixed(2);
    return { label: "Total CGPA", value: cgpaValue };
  }, [processedSemestersData]);

  // --- Dynamic Credit Calculation ---
  const totalCreditsRegistered = useMemo(() => {
    return processedSemestersData.reduce((total, sem) => 
      total + sem.courses.reduce((semTotal, course) => semTotal + (parseFloat(course.credit) || 0), 0)
    , 0);
  }, [processedSemestersData]);

  const totalCreditsEarned = useMemo(() => {
    return processedSemestersData.reduce((total, sem) => 
      total + sem.courses.filter(c => gradeToPoint(c.grade) > 0).reduce((semTotal, course) => semTotal + (parseFloat(course.credit) || 0), 0)
    , 0);
  }, [processedSemestersData]);

  const creditDetailsColumns = [
    { title: "Description", key: "description" },
    { title: "Value", key: "value", width: "20%" },
  ];
  const creditDetailsData = useMemo(() => [
    { description: "Total Credits Registered", value: totalCreditsRegistered },
    { description: "Total Credits Earned", value: totalCreditsEarned },
  ], [totalCreditsRegistered, totalCreditsEarned]);

  // Helper to render summary rows (SGPA/CGPA)
  const renderSummaryRow = (label, value, isLastRow = false) => (
    <div className="d-flex align-items-center px-3 py-2" style={{ fontSize: '0.875rem', borderBottom: isLastRow ? 'none' : '1px solid #e3e6f0', backgroundColor: '#f8f9fc' }}>
      <div style={{ width: gradeColumns[0].width }}>&nbsp;</div>
      <div style={{ width: gradeColumns[1].width }}>&nbsp;</div>
      <div style={{ width: gradeColumns[2].width }}>&nbsp;</div>
      <div style={{ width: gradeColumns[3].width, fontWeight: 'bold', textAlign: 'right', paddingRight: '1em' }}>{label}</div>
      <div style={{ width: gradeColumns[4].width }}>&nbsp;</div>
      <div style={{ width: gradeColumns[5].width, fontWeight: 'bold' }}>{value}</div>
    </div>
  );

  if (isLoadingProfile) {
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

  if (isErrorProfile) {
    return (
      <div>
        <Navbar toggleSidebar={toggleSidebar} studentProfile={undefined} isLoadingProfile={false} isErrorProfile={true} />
        <div id="layoutSidenav" className={`d-flex flex-grow-1 ${isSidebarOpen ? "" : "sidenav-closed"}`}>
          <div id="layoutSidenav_nav"><SidebarMenu studentProfile={undefined} /></div>
          <div id="layoutSidenav_content" className="flex-grow-1">
            <div className="container mt-4 text-center"><p>Error loading profile: {errorProfile?.message || 'Essential data could not be loaded.'}</p></div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for grades
  if (isLoadingGradesData) {
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

  // Error state for grades
  if (isErrorGradesData) {
    return (
      <div>
        <Navbar toggleSidebar={toggleSidebar} studentProfile={studentProfile} isLoadingProfile={isLoadingProfile} isErrorProfile={isErrorProfile} />
        <div id="layoutSidenav" className={`d-flex flex-grow-1 ${isSidebarOpen ? "" : "sidenav-closed"}`}>
          <div id="layoutSidenav_nav"><SidebarMenu studentProfile={studentProfile} /></div>
          <div id="layoutSidenav_content" className="flex-grow-1">
            <div className="container mt-4 text-center">
              <p>Error loading grade details: {errorGradesData?.message || 'Could not load grade information.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} studentProfile={studentProfile} isLoadingProfile={isLoadingProfile} isErrorProfile={isErrorProfile} />
      <div id="layoutSidenav" className={`d-flex flex-grow-1 ${isSidebarOpen ? "" : "sidenav-closed"}`}>
        <div id="layoutSidenav_nav"><SidebarMenu studentProfile={studentProfile} /></div>
        <div id="layoutSidenav_content" className="flex-grow-1">
          <div className="container-fluid px-4 mt-4">
            <div className="card mb-4">
              <div className="card-header bg-custom text-white d-flex justify-content-between align-items-center">
                <span>Grade / Mark Obtained</span>
                <button className="btn btn-sm btn-light" onClick={() => setShowGradeDetailsModal(true)}>View Grade Details</button>
              </div>
              <div className="card-body p-0">
                {processedSemestersData.map((semester, index) => (
                  <React.Fragment key={semester.semesterNumber}>
                    <Table 
                      columns={gradeColumns} 
                      data={semester.courses} 
                      isLoading={isLoadingGrades} // This now correctly uses isLoadingGradesData
                    />
                    {renderSummaryRow(`SGPA `, semester.sgpa, index === processedSemestersData.length - 1 && !totalCGPA)}
                  </React.Fragment>
                ))}
                {/* Render Total CGPA after all semesters */}
                {processedSemestersData.length > 0 && renderSummaryRow(totalCGPA.label, totalCGPA.value, true)}
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-custom text-white">Credit Details</div>
              <div className="card-body p-0">
                <Table columns={creditDetailsColumns} data={creditDetailsData} isLoading={isLoadingCredits} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGradeDetailsModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" id="LegendModal" tabIndex="-1" aria-labelledby="exampleModalLabel" style={{ display: 'block', paddingRight: '19.9854px' }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-scrollable" role="document">
              <div className="modal-content">
                <div className="modal-header bg-custom ">
                  <h5 className="modal-title text-white" id="exampleModalLabel">Grade Details</h5>
                  <button className="close" type="button" onClick={() => setShowGradeDetailsModal(false)} aria-label="Close">
                    <span className="text-white" aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive table-billing-history">
                    <table className="table mb-0">
                      <thead className="bg-custom text-white">
                        <tr>
                          <th width="20%" scope="col">Grade</th>
                          <th width="25%" scope="col">Marks Range</th>
                          <th width="20%" scope="col">Grade Points</th>
                          <th width="35%" scope="col">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr valign="top">
                          <td>O</td>
                          <td>91-100</td>
                          <td>10</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>A+</td>
                          <td>81-90</td>
                          <td>9</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>A</td>
                          <td>71-80</td>
                          <td>8</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>B+</td>
                          <td>61-70</td>
                          <td>7</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>B</td>
                          <td>56-60</td>
                          <td>6</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>C</td>
                          <td>50-55</td>
                          <td>5</td>
                          <td>PASS</td>
                        </tr>
                        <tr valign="top">
                          <td>F</td>
                          <td>0-49</td>
                          <td>0</td>
                          <td>FAIL</td>
                        </tr>
                        <tr valign="top">
                          <td>Ab</td>
                          <td>-</td>
                          <td>0</td>
                          <td>INCOMPLETE</td>
                        </tr>
                        <tr valign="top">
                          <td>I</td>
                          <td>-</td>
                          <td>0</td>
                          <td>FAIL</td>
                        </tr>
                        {/* Removed rows for *, W as they are not in the primary grade point image */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-dark lift" type="button" onClick={() => setShowGradeDetailsModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Grade;
