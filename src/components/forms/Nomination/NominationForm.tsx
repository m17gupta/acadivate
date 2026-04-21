"use client";
import React, { useState, useEffect } from "react";
import { Eye, FileDown, Trash2 } from "lucide-react";
import { downloadNominationPDF } from './downloadNominationPDF';
import styles from './NominationForm.module.css';
import { AppDispatch, RootState } from '@/src/hook/store';
import { useDispatch, useSelector } from 'react-redux';
import { createNominationThunk, updateNominationThunk } from '@/src/hook/nominations/nominationThunk';
import { NominationFormType } from '@/src/hook/nominations/nominationType';
import { useRouter } from 'next/navigation';
import { setCurrentNomination } from '@/src/hook/nominations/nominationSlice';
import { academicAwards, entrepreneurAwards, riseAwards, startupAwards } from './util';
import Script from 'next/script';
import { OrderType } from "../../orders/OrderType";


const BASE_FEE = 5500;
const GST_RATE = 0.18;
const HANDLING_PER_CAT = 500;

interface NominationFormProps {
  readOnly?: boolean;
}

const NominationForm: React.FC<NominationFormProps> = ({ readOnly = false }) => {
  const router = useRouter();
  const currentNomination = useSelector(
    (state: RootState) => state.nominations.currentNomination,
  );
  const [formData, setFormData] = useState({
    orgName: "",
    promoter: "",
    ownership: "",
    address: "",
    mobile: "",
    state: "",
    city: "",
    email: "",
    website: "",
    gstin: "",
    totalAmount: 6990,
    selectedAwards: [],
    paymentMode: "Online Banking",
    agreeTerms: false,
    researchPublication: [] as File[],
    bookPublication: [] as File[],
    researchProject: [] as File[],
    patentPolicyDocument: [] as File[],
    status: "pending",
  });
  const [selectedAwards, setSelectedAwards] = useState({
    academic: [] as string[],
    startup: [] as string[],
    rise: [] as string[],
    entrepreneur: [] as string[],
  });
  const [payableAmount, setPayableAmount] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? Array.from(files) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Delete a file from a specific field
  const handleDeleteFile = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as File[]).filter((_, i) => i !== index),
    }));
  };

  const handleAwardChange = (
    category: keyof typeof selectedAwards,
    award: string,
    checked: boolean,
  ) => {
    setSelectedAwards((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], award]
        : prev[category].filter((a) => a !== award),
    }));
  };

  // Pre-fill form when currentNomination is loaded from Redux
  useEffect(() => {
    if (currentNomination) {
      setFormData((prev) => ({
        ...prev,
        orgName: currentNomination.orgName ?? "",
        promoter: currentNomination.promoter ?? "",
        ownership: currentNomination.ownership ?? "",
        address: currentNomination.address ?? "",
        mobile: currentNomination.mobile ?? "",
        state: currentNomination.state ?? "",
        city: currentNomination.city ?? "",
        email: currentNomination.email ?? "",
        website: currentNomination.website ?? "",
        gstin: currentNomination.gstin ?? "",
        paymentMode: currentNomination.paymentMode ?? "Online Banking",
        agreeTerms: !!currentNomination.agreeTerms,
        status: currentNomination.status ?? "pending",
      }));
      setSelectedAwards({
        academic: currentNomination.academicAwards ?? [],
        startup: currentNomination.startupAwards ?? [],
        rise: currentNomination.riseAwards ?? [],
        entrepreneur: currentNomination.entrepreneurAwards ?? [],
      });
    }
  }, [currentNomination]);

  // Recalculate payable amount whenever selected awards change
  useEffect(() => {
    const selectedCount = Object.values(selectedAwards).flat().length;
    if (selectedCount === 0) {
      setPayableAmount(0);
    } else {
      const subtotal = selectedCount * BASE_FEE;
      const gst = subtotal * GST_RATE;
      const handling = selectedCount * HANDLING_PER_CAT;
      const total = subtotal + gst + handling;
      setPayableAmount(total);
    }
  }, [selectedAwards]);

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(
      () => setToast({ show: false, message: "", isError: false }),
      3500,
    );
  };

  const paymentHandler = async (data: NominationFormType) => {

    let options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: `${data?.totalAmount ?? 6990}`, // Amount is in currency subunits.
      currency: "INR",
      name: "Acadivate", //your business name
      description: "Test Transaction",
      image: "https://acadivate.com/logo.png",
      order_id: (data as any).order?.id, // Use the order ID returned from server
      handler: async function (response: any) {
   
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);

        const orderData: OrderType = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: data?.totalAmount ?? 0,
          formId: data._id,
          status: "success",
        }

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });
        const result = await res.json();
        setLoading(false);
        if (result.success) {
          showToast("Payment successful");
        } else {
          console.log(result.error)
          // showToast(result.error, true);
        }
      },
      prefill: {
        name: data.promoter, //your customer's name
        email: data.email,
        contact: data.mobile, //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: data.address,
      },
      theme: {
        color: "#3399cc",
      },
    };

    if (!(window as any).Razorpay) {
      showToast("Razorpay SDK failed to load. Please check your internet connection.", true);
      return;
    }
    var rzp1: any = new (window as any).Razorpay(options);

    rzp1.on("payment.failed", function (response: any) {
      setLoading(false);
  
      alert(response.error.description);
    });
    rzp1.open();

  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (payableAmount === 0) {
      showToast("Cannot proceed with zero fee (select categories)", true);
      return;
    }

    setLoading(true);
    try {
      const formDataObj: NominationFormType = {
        orgName: formData.orgName,
        promoter: formData.promoter,
        ownership: formData.ownership,
        address: formData.address,
        mobile: formData.mobile,
        state: formData.state,
        city: formData.city,
        email: formData.email,
        website: formData.website,
        agreeTerms: formData.agreeTerms,
        gstin: formData.gstin,
        paymentMode: formData.paymentMode,
        academicAwards: selectedAwards.academic,
        startupAwards: selectedAwards.startup,
        riseAwards: selectedAwards.rise,
        entrepreneurAwards: selectedAwards.entrepreneur,
        researchPublication: [],
        bookPublication: [],
        researchProject: [],
        patentPolicyDocument: [],
        status: "pending",
        totalAmount: payableAmount,
      };

      const response = await dispatch(
        createNominationThunk(formDataObj),
      ).unwrap();

 
      if (response._id) {
     
         await paymentHandler(response);
        const uploadResult = await uploadFiles({
          researchPublication: formData.researchPublication,
          bookPublication: formData.bookPublication,
          researchProject: formData.researchProject,
          patentPolicyDocument: formData.patentPolicyDocument,
          pathName: `/nomination-form/${response._id}`,
        });
   console.log("upload data- files-->", uploadResult)
        if (uploadResult.success) {
          await dispatch(updateNominationThunk({
            ...response,
            ...uploadResult.data
          })).unwrap();
        }
      } else {
        showToast(`✗ Nomination submission failed!`, true);
        setLoading(false);
      }
    } catch (error) {

      showToast("✗ Something went wrong. Please try again.", true);
      setLoading(false);
    }
  };

  const uploadFiles = async (data: {
    researchPublication: File[];
    bookPublication: File[];
    researchProject: File[];
    patentPolicyDocument: File[];
    pathName: string;
  }) => {
    const formData = new FormData();

    // Append the pathName to the formData
    formData.append("pathName", data.pathName);

    // Loop through each category and append files to formData
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Check if the value is an array of files
        value.forEach((file: File) => {
          formData.append(key, file); // same key, multiple files
        });
      }
    });

    const res = await fetch("/api/uploadfile", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    return result;
  };

  const renderAwardSection = (
    title: string,
    icon: string,
    awards: string[],
    category: keyof typeof selectedAwards,
  ) => (
    <div className={styles["categories-section"]}>
      <div className={styles["section-title"]}>
        <i className={`fas ${icon}`}></i> {title}
      </div>
      <div className={styles["cat-grid"]}>
        {awards.map((award) => (
          <div key={award} className={styles["cat-item"]}>
            <input
              type="checkbox"
              checked={selectedAwards[category].includes(award)}
              onChange={(e) =>
                handleAwardChange(category, award, e.target.checked)
              }
              disabled={readOnly}
            />
            <label>{award}</label>
          </div>
        ))}
      </div>
    </div>
  );
  const handleClose = () => {
    dispatch(setCurrentNomination(null))
    router.back()
  }

  const handleAutoFill = () => {
    setFormData((prev) => ({
      ...prev,
      orgName: "Acadivate Tech Solutions",
      promoter: "John Doe",
      ownership: "Pvt Limited",
      address: "123 Innovation Drive, Tech Park, Mumbai 400001",
      mobile: "9876543210",
      state: "Maharashtra",
      city: "Mumbai",
      email: "test@acadivate.com",
      website: "https://acadivate.com",
      gstin: "27AAAAA0000A1Z5",
      paymentMode: "Online Banking",
      agreeTerms: true,
    }));

    // Select one award from each category as sample
    setSelectedAwards({
      academic: [academicAwards[0]],
      startup: [startupAwards[0]],
      rise: [riseAwards[0]],
      entrepreneur: [entrepreneurAwards[0]],
    });
  };

  const handleDownloadPDF = async () => {
    // Strip File[] fields – they're not serialisable and not needed in the PDF
    const { researchPublication, bookPublication, researchProject, patentPolicyDocument, ...rest } = formData;
    const pdfData = {
      ...rest,
      academicAwards: selectedAwards.academic,
      startupAwards: selectedAwards.startup,
      riseAwards: selectedAwards.rise,
      entrepreneurAwards: selectedAwards.entrepreneur,
      totalAmount: payableAmount || formData.totalAmount,
    };
    await downloadNominationPDF(pdfData);
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles["hero-badge"]}>
            <i className="fas fa-trophy"></i> Nominations Are Now Open
          </div>
          <h1>
            <i className="fas fa-award"></i> Acadivate Award Registration
          </h1>
          <div className={styles.subhead}>
            If you wish to nominate for awards, kindly fill in the form below.
            Select one or more categories.
          </div>
        </div>

        <div className={styles["form-card"]}>
          <div className={styles["form-header"]}>
            <h2>
              <i className="fas fa-pen-alt"></i> Nomination Form
            </h2>
            <p>
              Please provide accurate details. Registration fee applies per
              selected category.
            </p>
            {/* {!readOnly && (
              <button
                type="button"
                onClick={handleAutoFill}
                className={styles["autofill-btn"]}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.8rem",
                  background: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "6px",
                  color: "#4338ca",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <i className="fas fa-magic"></i> Auto Fill (Dev Mode)
              </button>
            )} */}
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles["form-grid"]}>
              <div
                className={`${styles["input-group"]} ${styles["full-width"]}`}
              >
                <label>
                  <i className="fas fa-building"></i> Name of the Organizatio
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleInputChange}
                  placeholder="Enter Organization"
                  required
                  disabled={readOnly}
                />
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-user-tie"></i> Name of the promoter
                </label>
                <input
                  type="text"
                  name="promoter"
                  value={formData.promoter}
                  onChange={handleInputChange}
                  placeholder="Enter Promoter"
                  required
                  disabled={readOnly}
                />
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-chart-line"></i> Ownership Pattern
                </label>
                <div className={styles["ownership-group"]}>
                  {[
                    "Academcian",
                    "Scientist",
                    "Reseach Scholar",
                    "Proprietary",
                    "Partnership",
                    "Pvt Limited",
                    "Public Limited",
                    "NGOs",
                    "Others",
                  ].map((option) => (
                    <label key={option}>
                      <input
                        type="radio"
                        name="ownership"
                        value={option}
                        checked={formData.ownership === option}
                        onChange={handleInputChange}
                        disabled={readOnly}
                      />{" "}
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div
                className={`${styles["input-group"]} ${styles["full-width"]}`}
              >
                <label>
                  <i className="fas fa-map-marker-alt"></i> Address of
                  Correspondence
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full address"
                  required
                  disabled={readOnly}
                ></textarea>
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-mobile-alt"></i> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile Number"
                  required
                  disabled={readOnly}
                />
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-globe"></i> State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={readOnly}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Gujarat</option>
                  <option>West Bengal</option>
                  <option>Uttar Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Others</option>
                </select>
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-city"></i> City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={readOnly}
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  <option>Mumbai</option>
                  <option>Delhi</option>
                  <option>Bengaluru</option>
                  <option>Chennai</option>
                  <option>Kolkata</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Ahmedabad</option>
                  <option>Others</option>
                </select>
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-envelope"></i> Email id
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  required
                  disabled={readOnly}
                />
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-link"></i> Website URL
                </label>
                <input
                  type="string"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter Website URL"
                  disabled={readOnly}
                />
              </div>
              <div className={styles["input-group"]}>
                <label>
                  <i className="fas fa-file-invoice"></i> GSTIN
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  placeholder="Enter GSTIN"
                  disabled={readOnly}
                />
              </div>
              {/* PDF Attachment Fields */}
              <div
                className={styles["input-group"]}
                style={{ marginBottom: "1.5rem" }}
              >
                <label>Research Publication (PDF, multiple allowed)</label>
                <input
                  type="file"
                  name="researchPublication"
                  accept="application/pdf"
                  multiple
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
                {formData.researchPublication.length > 0 && (
                  <ul
                    style={{
                      margin: "0.5rem 0 0 0",
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {formData.researchPublication.map((file, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginBottom: "0.25rem",
                          border: "1px solid #b3b3ff",
                          borderRadius: "8px",
                          padding: "0.3rem 0.7rem",
                          background: "#f8faff",
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </span>

                        <Eye
                          size={18}
                          color="#222"
                          onClick={() =>
                            window.open(URL.createObjectURL(file), "_blank")
                          }
                        />

                        <Trash2
                          size={18}
                          color="red"
                          onClick={() =>
                            handleDeleteFile("researchPublication", idx)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={styles["input-group"]}
                style={{ marginBottom: "1.5rem" }}
              >
                <label>Book Publication (PDF, multiple allowed)</label>
                <input
                  type="file"
                  name="bookPublication"
                  accept="application/pdf"
                  multiple
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
                {formData.bookPublication.length > 0 && (
                  <ul
                    style={{
                      margin: "0.5rem 0 0 0",
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {formData.bookPublication.map((file, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginBottom: "0.25rem",
                          border: "1px solid #b3b3ff",
                          borderRadius: "8px",
                          padding: "0.3rem 0.7rem",
                          background: "#f8faff",
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </span>

                        <Eye
                          size={18}
                          color="#222"
                          onClick={() =>
                            window.open(URL.createObjectURL(file), "_blank")
                          }
                        />

                        <Trash2
                          size={18}
                          color="red"
                          onClick={() =>
                            handleDeleteFile("bookPublication", idx)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={styles["input-group"]}
                style={{ marginBottom: "1.5rem" }}
              >
                <label>Research Project (PDF, multiple allowed)</label>
                <input
                  type="file"
                  name="researchProject"
                  accept="application/pdf"
                  multiple
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
                {formData.researchProject.length > 0 && (
                  <ul
                    style={{
                      margin: "0.5rem 0 0 0",
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {formData.researchProject.map((file, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginBottom: "0.25rem",
                          border: "1px solid #b3b3ff",
                          borderRadius: "8px",
                          padding: "0.3rem 0.7rem",
                          background: "#f8faff",
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </span>

                        <Eye
                          size={18}
                          color="#222"
                          onClick={() =>
                            window.open(URL.createObjectURL(file), "_blank")
                          }
                        />

                        <Trash2
                          size={18}
                          color="red"
                          onClick={() =>
                            handleDeleteFile("researchProject", idx)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                className={styles["input-group"]}
                style={{ marginBottom: "1.5rem" }}
              >
                <label>
                  Patent and Policy Document Sanction/Complication (PDF,
                  multiple allowed)
                </label>
                <input
                  type="file"
                  name="patentPolicyDocument"
                  accept="application/pdf"
                  multiple
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
                {formData.patentPolicyDocument.length > 0 && (
                  <ul
                    style={{
                      margin: "0.5rem 0 0 0",
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {formData.patentPolicyDocument.map((file, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginBottom: "0.25rem",
                          border: "1px solid #b3b3ff",
                          borderRadius: "8px",
                          padding: "0.3rem 0.7rem",
                          background: "#f8faff",
                        }}
                      >
                        <span
                          style={{
                            flex: 1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </span>

                        <Eye
                          size={18}
                          color="#222"
                          onClick={() =>
                            window.open(URL.createObjectURL(file), "_blank")
                          }
                        />

                        <Trash2
                          size={18}
                          color="red"
                          onClick={() =>
                            handleDeleteFile("patentPolicyDocument", idx)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {renderAwardSection(
              "Academic and Research Awards",
              "fa-graduation-cap",
              academicAwards,
              "academic",
            )}
            {renderAwardSection(
              "Start-up Awards",
              "fa-rocket",
              startupAwards,
              "startup",
            )}
            {renderAwardSection(
              "Rise Awards",
              "fa-chart-line",
              riseAwards,
              "rise",
            )}
            {renderAwardSection(
              "Entrepreneur Awards (Top Honours)",
              "fa-crown",
              entrepreneurAwards,
              "entrepreneur",
            )}

            <div className={styles["fee-summary"]}>
              <div className={styles["fee-block"]}>
                <div className={styles["fee-item"]}>
                  <strong>Registration Fees:</strong> INR 5500 (Exclusive GST
                  18% per category + handling charges)
                </div>
              </div>
              <div className={styles.payable}>
                Payable Amount: INR {payableAmount.toLocaleString("en-IN")}
              </div>
            </div>

            <div className={`${styles["input-group"]} ${styles["full-width"]}`}>
              <label>
                <i className="fas fa-credit-card"></i> Mode of Payment
              </label>
              <div className={styles["mode-row"]}>
                {[
                  "Online Banking",
                  "Credit/Debit Card",
                  "UPI",
                  "Bank Transfer",
                ].map((mode) => (
                  <label key={mode}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value={mode}
                      checked={formData.paymentMode === mode}
                      onChange={handleInputChange}
                      disabled={readOnly}
                    />{" "}
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.terms}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                required
                disabled={readOnly}
              />
              <label style={{ textTransform: "none", fontWeight: 500 }}>
                I agree to Terms & Conditions.
              </label>
            </div>

            <div className={styles['btn-row']}>
              {!readOnly && (
                <button type="submit" className={styles['btn-submit']} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Nomination
                    </>
                  )}
                </button>
              )}

              <button type="button" className={styles['btn-pdf']} onClick={handleDownloadPDF}>
                <FileDown size={18} /> Download PDF
              </button>

              <button type="button" className={styles['btn-close']} onClick={handleClose}>
                <i className="fas fa-times-circle"></i> Close
              </button>
            </div>
          </form>
        </div>

        {toast.show && (
          <div
            className={`${styles["success-toast"]} ${toast.show ? styles.show : ""}`}
            style={{ background: toast.isError ? "#c73e2f" : "#2b6e3c" }}
          >
            <i className="fas fa-check-circle"></i> <span>{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default NominationForm;
