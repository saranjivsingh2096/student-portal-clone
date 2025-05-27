import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCaptcha } from "./utils/captcha";

const LoginPage = ({ setIsAuthenticated }) => {
  const [login, setLogin] = useState("");
  const [passwd, setPasswd] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwdError, setPasswdError] = useState("");
  const [ccodeError, setCcodeError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => setLogin(e.target.value.toLowerCase());
  const handlePasswdChange = (e) => setPasswd(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    setLoginError("");
    setPasswdError("");
    setCcodeError("");
    setErrorMessage("");
    setLoading(true);

    if (!login) {
      setLoginError("Enter a User Id");
      isValid = false;
      refreshCaptcha();
    }

    if (!passwd) {
      setPasswdError("Enter a valid password");
      isValid = false;
      refreshCaptcha();
    }

    if (!userCaptcha) {
      setCcodeError("Enter valid Captcha");
      isValid = false;
      refreshCaptcha();
    } else if (userCaptcha !== captcha) {
      setErrorMessage("Incorrect CAPTCHA. Please try again.");
      isValid = false;
      refreshCaptcha();
    }

    if (isValid) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: login, password: passwd }),
        });

        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem("authToken", data.authToken);
          localStorage.setItem("user", login);
          setIsAuthenticated(true);
          navigate("/dashboard", { replace: true });
        } else {
          setErrorMessage(data.message || "Invalid credentials or captcha.");
          refreshCaptcha();
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        refreshCaptcha();
      }
    }

    if (!isValid) {
      refreshCaptcha();
    }

    setLoading(false);
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserCaptcha("");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12 col-md-12">
          <div className="card o-hidden shadow-lg my-1 border-0">
            <div className="row mb-1">
              <div className="col-md-3"></div>
              <div className="col-md-6 text-center">
                <img
                  className="mt-1"
                  src="./images/srmist.jpg"
                  alt="SRM IST"
                  width="275px"
                  height="90px"
                />
              </div>
              <div className="col-md-3"></div>
            </div>
            <div className="card-body p-0">
              <div className="row mt-3 ml-1 mr-1">
                <div className="col-md-7">
                  <p style={{ fontWeight: "bold", fontSize: "13pt" }}>
                    Dear Student,
                  </p>
                  <p>Welcome to SRMIST STUDENT PORTAL.</p>
                  <p>
                    You can access the student portal to know your academic and
                    financial details, etc.
                  </p>
                  <p>
                    SRMIST students can log in with NetID credentials. (i.e If
                    your mail id is abcd@srmist.edu.in, your NetID is abcd &amp;
                    password will be your email password)
                  </p>
                </div>
                <div className="col-lg-5">
                  <div className="card card-progress" id="divLogin">
                    <div className="card-header badge-custom text-center text-white">
                      Student Portal
                    </div>
                    <div className="card-body">
                      <form
                        onSubmit={handleSubmit}
                        className="needs-validation"
                        noValidate
                      >
                        <div className="form-group mb-4">
                          <label>NetID (without '@srmist.edu.in')</label>
                          <div className="input-group has-validation">
                            <span
                              className="input-group-text text-custom"
                              id="inputGroupPrepend"
                            >
                              <i className="fa fa-user"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="NetID"
                              required
                              maxLength="6"
                              value={login}
                              onChange={handleLoginChange}
                            />
                          </div>
                          {/* Display error for NetID */}
                          {loginError && (
                            <div className="text-danger mt-2">{loginError}</div>
                          )}
                        </div>

                        <div className="form-group mb-4">
                          <label>Password</label>
                          <div className="input-group has-validation">
                            <span
                              className="input-group-text text-custom"
                              id="inputGroupPrepend"
                            >
                              <i className="fa fa-key"></i>
                            </span>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Password"
                              required
                              value={passwd}
                              onChange={handlePasswdChange}
                            />
                          </div>
                          {/* Display error for Password */}
                          {passwdError && (
                            <div className="text-danger mt-2">
                              {passwdError}
                            </div>
                          )}
                          <div style={{ textAlign: "right" }}>
                            <a
                              href="https://ssp.srmist.edu.in/resetpassword/"
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Click to Reset Password"
                            >
                              Forgot Password?
                            </a>
                          </div>
                        </div>

                        <div>
                          <label>Captcha</label>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-6 input-group has-validation">
                            <span className="input-group-text text-custom">
                              <i className="fa fa-recycle"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              value={userCaptcha}
                              onChange={(e) => setUserCaptcha(e.target.value)}
                              placeholder="Captcha"
                              required
                            />
                          </div>

                          <div className="col-sm-4">
                            {/* Display CAPTCHA */}
                            <div
                              style={{
                                fontWeight: "bold",
                                userSelect: "none",
                                fontSize: "22px",
                                color: "#dc143c",
                                marginBottom: "10px",
                              }}
                            >
                              {captcha}
                            </div>
                          </div>

                          <div className="col-sm-2">
                            {/* Button to refresh CAPTCHA */}
                            <button
                              type="button"
                              className="btn btn-icon btn-transparent-dark order-1 order-lg-0 mr-lg-2"
                              onClick={refreshCaptcha}
                            >
                              <i className="fa fa-recycle"></i>
                            </button>
                          </div>
                        </div>
                        {/* Display captcha error */}
                        {ccodeError && (
                          <div className="text-danger mt-2">{ccodeError}</div>
                        )}

                        <button
                          type="submit"
                          className="btn btn-custom btn-user btn-block lift"
                        >
                          <i className="fa fa-lock fa-fw mr-1"></i> Login
                        </button>

                        {/* Show loading GIF when logging in */}
                        {loading && (
                          <div className="mt-3">
                            <img src="./images/wait.gif" alt="Loading..." />
                            <p>Logging in...</p>
                          </div>
                        )}

                        {/* Error message section */}
                        {errorMessage && (
                          <div
                            className="alert alert-danger alert-icon border-top-lg mt-3"
                            role="alert"
                          >
                            <div className="alert-icon-aside">
                              <i className="fa fa-bell-slash"></i>
                            </div>
                            <div className="alert-icon-content">
                              <h6 className="alert-heading">Alert</h6>
                              {errorMessage}
                            </div>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
