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

  const {
    data: studentProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student/profile`,
    ['studentProfile']
  );

  const {
    data: feeDetailsData,
    isLoading: isLoadingFeeDetails,
    isError: isErrorFeeDetails,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/student/fee-details`,
    ['feeDetails']
  );

  const {
    data: transactionLogData,
    isLoading: isLoadingTransactionLog,
    isError: isErrorTransactionLog,
  } = useFetchData(
    `${process.env.REACT_APP_API_URL}/payment/transaction-log-data`,
    ['transactionLog']
  );

  const unpaidFees = (!isLoadingFeeDetails && !isErrorFeeDetails && feeDetailsData && Array.isArray(feeDetailsData.allFees))
    ? feeDetailsData.allFees.filter(fee => !fee.paid)
    : [];

  const currentTransactionLog = (!isLoadingTransactionLog && !isErrorTransactionLog && transactionLogData && Array.isArray(transactionLogData.transactions))
    ? transactionLogData.transactions
    : [];

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  useEffect(() => {
    if (!isLoadingFeeDetails && !isErrorFeeDetails && unpaidFees.length > 0) {
      setIsPayButtonEnabled(true);
    } else {
      setIsPayButtonEnabled(false);
    }
  }, [unpaidFees, isLoadingFeeDetails, isErrorFeeDetails]);

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
        `${process.env.REACT_APP_API_URL}/payment/create-order`,
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
            }/payment/verify-payment?user=${localStorage.getItem("user")}&studentId=${
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

  if (isLoadingProfile) {
    return (
      <div>
        <Navbar toggleSidebar={toggleSidebar} studentProfile={undefined} isLoadingProfile={true} isErrorProfile={false} />
        <div id="layoutSidenav" className={`d-flex flex-grow-1 ${isSidebarOpen ? "" : "sidenav-closed"}`}>
          <div id="layoutSidenav_nav">
            <SidebarMenu studentProfile={undefined} />
          </div>
          <div id="layoutSidenav_content" className="flex-grow-1">
            <div className="container mt-4">
              <div>
                <img src="./images/wait.gif" alt="Loading Profile..." />
                <p>Loading Profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProfile || (!isLoadingProfile && !studentProfile)) {
    return (
      <div>
        <Navbar toggleSidebar={toggleSidebar} studentProfile={undefined} isLoadingProfile={false} isErrorProfile={true} />
        <div id="layoutSidenav" className={`d-flex flex-grow-1 ${isSidebarOpen ? "" : "sidenav-closed"}`}>
          <div id="layoutSidenav_nav">
            <SidebarMenu studentProfile={undefined} />
          </div>
          <div id="layoutSidenav_content" className="flex-grow-1">
            <div className="container mt-4 text-center">
              <p>Error loading student profile: {errorProfile?.message || 'Essential data could not be loaded.'}</p>
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
        <div id="layoutSidenav_nav">
          <SidebarMenu studentProfile={studentProfile} />
        </div>
        <div id="layoutSidenav_content" className="flex-grow-1">
          <div className="container mt-4">
            <div className="card mb-4">
              <div className="card-header bg-custom text-white">Fee Payment</div>
              <div align="center">
                <br />
                <button type="button" className="btn btn-custom rounded-pill lift mr-2" onClick={() => handleTableSwitch("feeDetails")}>
                  Pending Payments
                </button>
                <button type="button" className="btn btn-custom rounded-pill lift" onClick={() => handleTableSwitch("transactionLog")}>
                  Payment Transaction Log
                </button>
              </div>
              <div>&nbsp;</div>
            </div>

            {visibleTable === "feeDetails" && (
              <div className="card mb-4">
                <div className="card-header bg-custom text-white">Fee Details</div>
                <div className="table-responsive">
                  <Table
                    columns={feeDetailsColumns}
                    data={unpaidFees}
                    isLoading={false}
                    isTotalRow={false}
                  />
                  <div className="mt-3 ml-4" style={{ fontSize: "10px" }}><font color="blue">* Service charges as applicable</font></div>
                  <div align="center">
                    <button
                      type="submit"
                      className={`btn btn-custom rounded-pill mx-auto mb-4 ${isPayButtonEnabled ? "lift" : ""}`}
                      id="paybutton"
                      style={{ backgroundColor: "#337ab7" }}
                      disabled={!isPayButtonEnabled}
                      onClick={openRazorpay}
                    >
                      Proceed to payment <i className="fa fa-long-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {visibleTable === "transactionLog" && (
              <div className="card mb-4">
                <div className="card-header bg-custom text-white">Payment Transaction Log</div>
                <div className="table-responsive">
                  <Table
                    columns={transactionLogColumns}
                    data={currentTransactionLog}
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
