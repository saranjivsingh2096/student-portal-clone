import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SidebarMenu from "./components/SidebarMenu";
import Table from "./components/Table";
import useFetchData from "./utils/useFetchData";

const FeePayment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleTable, setVisibleTable] = useState(null);
  const [isPayButtonEnabled, setIsPayButtonEnabled] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-toggled", "sidenav-toggled");
    } else {
      document.body.classList.remove("sidebar-toggled", "sidenav-toggled");
    }
  }, [isSidebarOpen]);

  const { data: studentProfile } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student-profile`
  );

  const { data: feeDetailsData } = useFetchData(
    `${process.env.REACT_APP_API_URL}/fee-details`
  );
  const { data: transactionLogData } = useFetchData(
    `${process.env.REACT_APP_API_URL}/transaction-log-data`
  );

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  });

  useEffect(() => {
    if (feeDetailsData.length > 0) {
      setIsPayButtonEnabled(true);
    }
  }, [feeDetailsData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTableSwitch = (table) => {
    setVisibleTable(table);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ user: localStorage.getItem("user") }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to fetch Razorpay order details");

      const { orderId, amount } = await response.json();
      const razorpay = new window.Razorpay({
        key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
        amount,
        currency: "INR",
        name: "SRM University",
        description: "Fee Payment",
        order_id: orderId,
        handler: async (paymentResponse) => {
          const paymentVerification = await fetch(
            `${
              process.env.REACT_APP_API_URL
            }/verify-payment?user=${localStorage.getItem("user")}&studentId=${
              studentProfile.studentId
            }`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({
                paymentId: paymentResponse.razorpay_payment_id,
                orderId,
                amount,
              }),
            }
          );
          const verificationResult = await paymentVerification.json();
          if (verificationResult.success) {
            alert("Payment successful!");
            window.location.reload();
          } else {
            alert("Payment verification failed on the server.");
          }
        },
        prefill: {
          name: studentProfile?.studentName,
          email: studentProfile?.email,
          contact: studentProfile?.studentMobile,
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
    }
  };

  const feeDetailsColumns = [
    { title: "Fee Type", key: "feeType", width: "12%" },
    { title: "Year / Month", key: "yearMonth", width: "12%" },
    { title: "Raised Amount (₹)", key: "raisedAmount", width: "12%" },
    {
      title: "Last Date for Fee Payment - Without Late Fee",
      key: "lastDateWithoutLateFee",
      width: "12%",
    },
    {
      title: "Last Date for Fee Payment - With Late Fee",
      key: "lastDateWithLateFee",
      width: "12%",
    },
    { title: "Fee + Late Fee (₹)", key: "feeWithLateFee", width: "10%" },
    {
      title: "Last Date for Fee Payment - With Penalty",
      key: "lastDateWithPenalty",
      width: "12%",
    },
    {
      title: "Fee + Late Fee + Penalty (₹)",
      key: "feeWithPenalty",
      width: "12%",
    },
    { title: "Paid Amount (₹)", key: "paidAmount", width: "12%" },
    { title: "Concession Amount (₹)", key: "concessionAmount", width: "12%" },
    { title: "Amount To Pay (₹)", key: "amountToPay", width: "12%" },
    {
      title: "Minimum Amount Allowed (₹)",
      key: "minimumAmountAllowed",
      width: "12%",
    },
    { title: "Enter Amount to Pay (₹)", key: "enterAmountToPay", width: "12%" },
  ];

  const transactionLogColumns = [
    { title: "Student Id", key: "studentId", width: "12%" },
    { title: "SRM Transaction Id", key: "srmTransactionId", width: "12%" },
    { title: "Bank Transaction Id", key: "bankTransactionId", width: "12%" },
    { title: "Total Amount", key: "totalAmount", width: "12%" },
    { title: "Payment Status", key: "paymentStatus", width: "12%" },
    { title: "Transaction Date", key: "transactionDate", width: "12%" },
    { title: "Payment Gateway", key: "paymentGateway", width: "12%" },
  ];

  if (!studentProfile || !feeDetailsData || !transactionLogData) {
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
                <img
                  src="https://sp.srmist.edu.in/srmiststudentportal/resources/Image/wait.gif"
                  alt="Loading..."
                />
                <p>Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="card mb-4">
              <div className="card-header bg-custom text-white">
                Fee Payment
              </div>
              <div align="center">
                <br />
                <button
                  type="button"
                  className="btn btn-custom rounded-pill lift mr-2"
                  onClick={() => handleTableSwitch("feeDetails")}
                >
                  Fee Details
                </button>
                <button
                  type="button"
                  className="btn btn-custom rounded-pill lift"
                  onClick={() => handleTableSwitch("transactionLog")}
                >
                  Payment Transaction Log
                </button>
              </div>
              <div>&nbsp;</div>
            </div>

            {/* Render Fee Details Table */}
            {visibleTable === "feeDetails" && (
              <div className="card mb-4">
                <div className="card-header bg-custom text-white">
                  Fee Details
                </div>
                <div className="table-responsive">
                  <Table
                    columns={feeDetailsColumns}
                    data={feeDetailsData}
                    isLoading={false}
                    isTotalRow={false}
                  />
                  <div className="mt-3 ml-4" style={{ fontSize: "10px" }}>
                    <font color="blue">* Service charges as applicable</font>
                  </div>

                  <div align="center">
                    <button
                      type="submit"
                      className={`btn btn-custom rounded-pill mx-auto mb-4 ${
                        isPayButtonEnabled ? "lift" : ""
                      }`}
                      id="paybutton"
                      style={{ backgroundColor: "#337ab7" }}
                      disabled={!isPayButtonEnabled}
                      onClick={openRazorpay}
                    >
                      Proceed to payment
                      <i className="fa fa-long-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Render Transaction Log Table */}
            {visibleTable === "transactionLog" && (
              <div className="card mb-4">
                <div className="card-header bg-custom text-white">
                  Payment Transaction Log
                </div>
                <div className="table-responsive">
                  <Table
                    columns={transactionLogColumns}
                    data={transactionLogData}
                    isLoading={false}
                    isTotalRow={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeePayment;
