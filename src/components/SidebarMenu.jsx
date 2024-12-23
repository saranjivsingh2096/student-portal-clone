import React from "react";
import { Link } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";

const SidebarMenu = ({ studentProfile, currentDateTime }) => {
  return (
    <>
      <nav className="sidenav shadow-right sidenav-light">
        <div className="sidenav-menu">
          <div className="nav accordion" id="accordionSidenav">
            <Link to="/dashboard" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-tachometer-alt"></i>
              </div>
              Dashboard
            </Link>

            <Link to="/personal-details" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-user"></i>
              </div>
              Personal Information
            </Link>

            <Link to="/internal-marks" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-chart-bar"></i>
              </div>
              Internal Marks Details
            </Link>

            <Link to="/course-list" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-book"></i>
              </div>
              Course List
            </Link>

            <Link to="/attendance-details" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-calendar-check"></i>
              </div>
              Attendance Details
            </Link>

            <Link to="/abc-entry" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-book"></i>
              </div>
              ABC Entry Request
            </Link>

            <Link to="/fee-payment" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-credit-card"></i>
              </div>
              Fee Payment
            </Link>

            <Link to="/exam-hallticket" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-ticket-alt"></i>
              </div>
              Exam HallTicket
            </Link>

            <Link to="/summer-term-registration" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-calendar-plus"></i>
              </div>
              Summer Term Registration
            </Link>

            <Link to="/scribe-request" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-pencil-alt"></i>
              </div>
              Scribe Request
            </Link>

            <Link to="/revaluation-registration" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-edit"></i>
              </div>
              Revaluation Registration
            </Link>

            <Link to="/transcript" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-file-alt"></i>
              </div>
              Transcript
            </Link>

            <Link to="/name-change" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-user-edit"></i>
              </div>
              Name Change - Gazette
            </Link>

            <Link to="/community-certificate" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-certificate"></i>
              </div>
              Community Certificate
            </Link>

            <Link to="/placement-insight" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-briefcase"></i>
              </div>
              Placement Insight
            </Link>

            <Link to="/student-feedback" className="nav-link navmenu">
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-comments"></i>
              </div>
              Student Feedback
            </Link>
          </div>
        </div>
        {/* Sidebar Footer */}
        <SidebarFooter
          studentProfile={studentProfile}
          currentDateTime={currentDateTime}
        />
      </nav>
    </>
  );
};

export default SidebarMenu;
