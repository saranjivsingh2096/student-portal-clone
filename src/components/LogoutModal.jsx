import React from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/authUtils";

const LogoutModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="logoutModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Logout
            </h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close"
            >
              <span className="text-white" aria-hidden="true">
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">Are you sure you want to logout?</div>
          <div className="modal-footer">
            <button
              className="btn btn-dark lift"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-custom lift"
              type="button"
              onClick={() => handleLogout(navigate)}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
