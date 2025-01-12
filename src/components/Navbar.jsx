import React, { useState } from "react";
import LogoutModal from "./LogoutModal";
import useFetchData from "../utils/useFetchData";

const Navbar = ({ toggleSidebar }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const { data: studentProfile } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`
  );

  return (
    <nav
      className="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-light bg-white"
      id="sidenavAccordion"
    >
      <button
        className="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2"
        id="sidebarToggle"
        onClick={toggleSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>
      <div className="navbar-brand">
        <img src="./images/srmist.png" alt="SRM Logo" />
        <br />
        <font style={{ fontSize: "9pt" }}>Student Portal</font>
      </div>
      <span className="text-custom d-none d-sm-block">
        <b>{studentProfile?.institution}</b>
      </span>
      <ul className="navbar-nav align-items-center ml-auto text-center">
        <div className="nav-link" onClick={handleLogoutClick}>
          <div className="nav-link-icon">
            <i className="fas fa-sign-out-alt"></i>
          </div>
          Logout
        </div>
      </ul>
      <LogoutModal show={showModal} onClose={handleCloseModal} />
    </nav>
  );
};

export default Navbar;
