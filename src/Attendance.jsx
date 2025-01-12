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

  const { data: AttendanceData } = useFetchData(
    `${process.env.REACT_APP_API_URL}/attendance-data`
  );

  const { data: studentProfile } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`
  );

  if (
    !AttendanceData ||
    !AttendanceData.courseWiseAttendance ||
    !AttendanceData.cumulativeAttendance ||
    !studentProfile
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

  const {
    courseWiseAttendance,
    cumulativeAttendance,
    attendancePeriodStartDate,
    attendancePeriodEndDate,
  } = AttendanceData || {};

  // Calculate Attendance Percentage for each course
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

  // Calculate present and absent percentages
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
                  columns={[
                    { title: "Code", key: "code", width: "10%" },
                    { title: "Description", key: "description", width: "32%" },
                    {
                      title: "Max. hours",
                      key: "maxHours",
                      width: "8%",
                      totalValue: courseWiseAttendance.reduce(
                        (sum, course) => sum + course.maxHours,
                        0
                      ),
                    },
                    {
                      title: "Att. hours",
                      key: "attendedHours",
                      width: "8%",
                      totalValue: courseWiseAttendance.reduce(
                        (sum, course) => sum + course.attendedHours,
                        0
                      ),
                    },
                    {
                      title: "Absent hours",
                      key: "absentHours",
                      width: "8%",
                      totalValue: courseWiseAttendance.reduce(
                        (sum, course) =>
                          sum + (course.maxHours - course.attendedHours),
                        0
                      ),
                    },
                    {
                      title: "Average %",
                      key: "averagePercentage",
                      width: "8%",
                      totalValue: (
                        (courseWiseAttendance.reduce(
                          (sum, course) => sum + course.attendedHours,
                          0
                        ) /
                          courseWiseAttendance.reduce(
                            (sum, course) => sum + course.maxHours,
                            0
                          )) *
                        100
                      ).toFixed(2),
                    },
                    {
                      title: "OD/ML Percentage",
                      key: "odMlPercentage",
                      width: "8%",
                      totalValue: courseWiseAttendance
                        .reduce((sum, course) => sum + course.odMlPercentage, 0)
                        .toFixed(2),
                    },
                    {
                      title: "Total Percentage",
                      key: "totalPercentage",
                      width: "8%",
                      totalValue: (
                        (courseWiseAttendance.reduce(
                          (sum, course) => sum + course.attendedHours,
                          0
                        ) /
                          courseWiseAttendance.reduce(
                            (sum, course) => sum + course.maxHours,
                            0
                          )) *
                        100 *
                        (1 +
                          courseWiseAttendance.reduce(
                            (sum, course) => sum + course.odMlPercentage,
                            0
                          ) /
                            100)
                      ).toFixed(2),
                    },
                  ]}
                  data={courseWiseAttendance.map((course) => ({
                    ...course,
                    absentHours: course.maxHours - course.attendedHours,
                    averagePercentage: (
                      (course.attendedHours / course.maxHours) *
                      100
                    ).toFixed(2),
                    totalPercentage: (
                      (course.attendedHours / course.maxHours) *
                      100 *
                      (1 + course.odMlPercentage / 100)
                    ).toFixed(2),
                  }))}
                  isLoading={!AttendanceData}
                  isTotalRow
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
                  data={cumulativeAttendance}
                  isLoading={!cumulativeAttendance}
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
