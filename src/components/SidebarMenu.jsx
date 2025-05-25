import React from "react";
import { NavLink } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";

const SidebarMenu = ({ studentProfile, currentDateTime }) => {
  const getNavLinkClass = ({ isActive }) => {
    return isActive 
      ? "nav-link navmenu active-link" 
      : "nav-link navmenu";
  };

  return (
    <>
      <nav className="sidenav shadow-right sidenav-light">
        <div className="sidenav-menu">
          <div className="nav accordion" id="accordionSidenav">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-tachometer-alt"></i>
              </div>
              Dashboard
            </NavLink>

            <NavLink to="/personal-details" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-user"></i>
              </div>
              Personal Information
            </NavLink>

            <NavLink to="/internal-marks" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-chart-bar"></i>
              </div>
              Internal Marks Details
            </NavLink>

            <NavLink to="/course-list" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-book"></i>
              </div>
              Course List
            </NavLink>

            <NavLink to="/attendance-details" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-calendar-check"></i>
              </div>
              Attendance Details
            </NavLink>

            <NavLink to="/abc-entry" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-book"></i>
              </div>
              ABC Entry Request
            </NavLink>

            <NavLink to="/fee-payment" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-credit-card"></i>
              </div>
              Fee Payment
            </NavLink>

            <NavLink to="/grade" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-chart-bar"></i>
              </div>
              Grade / Mark & Credits
            </NavLink>

            <NavLink to="/exam-hallticket" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-ticket-alt"></i>
              </div>
              Exam HallTicket
            </NavLink>

            <NavLink to="/summer-term-registration" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-calendar-plus"></i>
              </div>
              Summer Term Registration
            </NavLink>

            <NavLink to="/scribe-request" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-pencil-alt"></i>
              </div>
              Scribe Request
            </NavLink>

            <NavLink to="/revaluation-registration" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-edit"></i>
              </div>
              Revaluation Registration
            </NavLink>

            <NavLink to="/transcript" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-file-alt"></i>
              </div>
              Transcript
            </NavLink>

            <NavLink to="/name-change" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-user-edit"></i>
              </div>
              Name Change - Gazette
            </NavLink>

            <NavLink to="/community-certificate" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-certificate"></i>
              </div>
              Community Certificate
            </NavLink>

            <NavLink to="/placement-insight" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-briefcase"></i>
              </div>
              Placement Insight
            </NavLink>

            <NavLink to="/student-feedback" className={getNavLinkClass}>
              <div className="nav-link-icon">
                <i className="fas fa-fw fa-comments"></i>
              </div>
              Student Feedback
            </NavLink>
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
