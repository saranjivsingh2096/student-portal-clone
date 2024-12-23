import React, { useState, useEffect } from "react";

const SidebarFooter = ({ studentProfile }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="sidenav-footer">
      <div className="sidenav-footer-content">
        <div className="sidenav-footer-subtitle">
          {studentProfile?.registerNo}
        </div>
        <div className="sidenav-footer-subtitle">
          {studentProfile?.Studentname}
        </div>
        <div className="sidenav-footer-title">
          {currentDateTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
