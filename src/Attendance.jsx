import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import Table from "./components/Table";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import useFetchData from "./utils/useFetchData";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Attendance = () => {
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
    data: attendanceData,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
    error: errorAttendance,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/attendance-data`,
    ['attendanceData']
  );

  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`,
    ['studentProfile']
  );

  // Overall loading and error states for page content
  const pageIsLoading = isLoadingAttendance || isLoadingProfile;
  const pageIsError = isErrorAttendance || isErrorProfile;
  const pageError = errorAttendance || errorProfile;

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

  // Check for empty or incomplete data after loading and no errors
  if (
    !attendanceData ||
    !attendanceData.courseWiseAttendance ||
    !attendanceData.cumulativeAttendance ||
    !studentProfile
  ) {
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
              <p>Attendance data or profile is incomplete or unavailable.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    courseWiseAttendance,
    cumulativeAttendance,
    attendancePeriodStartDate,
    attendancePeriodEndDate,
  } = attendanceData;

  // Calculate Attendance Percentage for each course for the chart
  const chartData = {
    labels: courseWiseAttendance.map((course) => course.code),
    datasets: [
      {
        label: "Attendance (%)",
        data: courseWiseAttendance.map((course) => {
          // Calculate attendance percentage (avoid division by 0)
          const percentage =
            course.maxHours > 0
              ? (course.attendedHours / course.maxHours) * 100
              : 0;
          return percentage;
        }),
        backgroundColor: "#2e59d9", // Bar color
        borderColor: "#2e59d9", // Bar border color
        borderWidth: 1,
        barThickness: 22,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 20,
          minRotation: 20,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 25,
          max: 100,
          min: 0,
          callback: (value) => {
            if (value === 0 || value === 50 || value === 100) {
              return value + "%";
            }
            return "";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Calculate total attended and maximum hours
  const totalMaxHours = courseWiseAttendance.reduce(
    (sum, course) => sum + course.maxHours,
    0
  );
  const totalAttendedHours = courseWiseAttendance.reduce(
    (sum, course) => sum + course.attendedHours,
    0
  );

  // Calculate OD/ML impact
  const totalODMLHours = courseWiseAttendance.reduce(
    (sum, course) => sum + (course.maxHours * course.odMlPercentage) / 100,
    0
  );

  // Adjusted attended hours considering OD/ML
  const adjustedAttendedHours = totalAttendedHours + totalODMLHours;

  // Calculate present and absent percentages for Donut Chart
  const presentPercentage =
    totalMaxHours > 0
      ? Math.round((adjustedAttendedHours / totalMaxHours) * 100)
      : 0;
  const absentPercentage = 100 - presentPercentage;

  // Updated Donut Chart Data
  const donutChartData = {
    labels: ["Hours Present", "Hours Absent"],
    datasets: [
      {
        data: [presentPercentage, absentPercentage],
        backgroundColor: ["#00ba94", "#f4a100"],
        hoverOffset: 4,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.raw + "%"; // Add percentage to donut chart tooltips
          },
        },
      },
    },
    // Adjust the cutout percentage to control the donut's width
    cutout: 73, // This will reduce the width of the donut
  };

  // Calculate overall values for total row
  const overallAveragePercentageValue = totalMaxHours > 0 ? (totalAttendedHours / totalMaxHours) * 100 : 0;
  const sumOdMlPercentageValue = courseWiseAttendance.reduce((sum, course) => sum + (course.odMlPercentage || 0), 0);
  // User's formula for overall total percentage: AverageAtt% * (1 + SumOdML%/100)
  const overallTotalPercentageValue = overallAveragePercentageValue * (1 + sumOdMlPercentageValue / 100);

  const courseWiseColumns = [
    { title: "Code", key: "code", width: "10%" },
    { title: "Description", key: "description", width: "32%" },
    {
      title: "Max. hours",
      key: "maxHours",
      width: "8%",
      totalValue: totalMaxHours,
    },
    {
      title: "Att. hours",
      key: "attendedHours",
      width: "8%",
      totalValue: totalAttendedHours,
    },
    {
      title: "Absent hours",
      key: "absentHours",
      width: "8%",
      totalValue: totalMaxHours - totalAttendedHours,
    },
    {
      title: "Average %",
      key: "averagePercentage",
      width: "8%",
      totalValue: `${overallAveragePercentageValue.toFixed(2)}%`,
    },
    {
      title: "OD/ML %", // Changed from "OD/ML Percentage" to match Table example style
      key: "odMlPercentage",
      width: "8%",
      totalValue: `${sumOdMlPercentageValue.toFixed(2)}%`,
    },
    {
      title: "Total %", // Changed from "Total Percentage"
      key: "totalPercentage",
      width: "8%",
      totalValue: `${overallTotalPercentageValue.toFixed(2)}%`,
    },
  ];

  const courseWiseTableData = courseWiseAttendance.map((course) => {
    const maxHours = course.maxHours || 0;
    const attendedHours = course.attendedHours || 0;
    const odMlPercentage = course.odMlPercentage || 0;
    const absentHours = maxHours - attendedHours;
    const averagePercentage = maxHours > 0 ? (attendedHours / maxHours) * 100 : 0;
    // User's formula for per-row total percentage: AverageAtt% * (1 + ODML%/100)
    const totalPercentage = averagePercentage * (1 + odMlPercentage / 100);

    return {
      ...course,
      description: course.description || 'N/A',
      absentHours: absentHours,
      averagePercentage: `${averagePercentage.toFixed(2)}%`,
      odMlPercentage: `${odMlPercentage.toFixed(2)}%`, // Display individual OD/ML %
      totalPercentage: `${totalPercentage.toFixed(2)}%`,
      // Ensure original keys used by table are present if not overridden
      maxHours: maxHours,
      attendedHours: attendedHours,
    };
  });

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

        {/* Main Content */}
        <div id="layoutSidenav_content" className="flex-grow-1">
          <div className="container mt-4">
            <div className="row">
              {/* Bar Chart for Attendance (%) */}
              <div className="col-xl-8 col-lg-7">
                <div className="card shadow mb-4">
                  <div className="card-header bg-custom text-white">
                    Course Wise Attendance (%)
                  </div>
                  <div className="card-body">
                    <div className="chart-bar">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut Chart for Attendance Hours */}
              <div className="col-xl-4 col-lg-5">
                <div className="card shadow mb-4">
                  <div className="card-header bg-custom text-white">
                    Attendance Hours
                  </div>
                  <div className="card-body">
                    <div className="chart-pie">
                      <Doughnut
                        data={donutChartData}
                        options={donutChartOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Attendance Details Table */}
            <div className="card mb-4">
              <div className="card-header bg-custom text-white">
                COURSE WISE ATTENDANCE - During the Period:{" "}
                <b>{attendancePeriodStartDate}</b> To{" "}
                <b>{attendancePeriodEndDate}</b>
              </div>
              <div className="card-body p-0">
                <Table
                  columns={courseWiseColumns}
                  data={courseWiseTableData}
                  isLoading={isLoadingAttendance}
                  isTotalRow={true}
                />
              </div>
            </div>
            {/* Cumulative Attendance (In Hours) Table */}
            <div className="card mb-3">
              <div className="card-header bg-custom text-white">
                Cumulative Attendance (In Hours)
              </div>
              <div className="card-body">
                <Table
                  columns={[
                    { title: "Month / Year", key: "monthYear", width: "15%" },
                    { title: "Present", key: "present", width: "15%" },
                    { title: "Absent", key: "absent", width: "15%" },
                    { title: "OD (Present)", key: "odPresent", width: "15%" },
                    { title: "OD (Absent)", key: "odAbsent", width: "15%" },
                    { title: "ML", key: "ml", width: "15%" },
                  ]}
                  data={cumulativeAttendance || []}
                  isLoading={isLoadingAttendance}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
