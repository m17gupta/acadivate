"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Eye,
  FileDown,
  Trash2,
  Trophy,
  Award,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Check,
  Loader2,
  Trash,
  Download,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { downloadNominationPDF } from "./downloadNominationPDF";
import { downloadFile } from "@/src/hook/files/fileUtil";
import styles from "./NominationForm.module.css";
import { AppDispatch, RootState } from "@/src/hook/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createNominationThunk,
  updateNominationThunk,
} from "@/src/hook/nominations/nominationThunk";
import { NominationFormType } from "@/src/hook/nominations/nominationType";
import { useRouter } from "next/navigation";
import { setCurrentNomination } from "@/src/hook/nominations/nominationSlice";
// import {
//   academicAwards,
//   entrepreneurAwards,
//   riseAwards,
//   startupAwards,
// } from "./util";
import Script from "next/script";
import { OrderType } from "@/src/hook/orders/orderType";
import { createOrderThunk } from "@/src/hook/orders/orderThunk";
import GetNominationAwards from "./GetNominationAwards";
import GetEventBySlug from "../../events/GetEventBySlug";

const BASE_FEE = 5500;
const GST_RATE = 0.18;
const HANDLING_PER_CAT = 500;

interface NominationFormProps {
  readOnly?: boolean;
}

const NominationForm: React.FC<NominationFormProps> = ({
  readOnly = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const currentNomination = useSelector(
    (state: RootState) => state.nominations.currentNomination,
  );
  const currentAwardCategory = useSelector(
    (state: RootState) => state.awardCategories.currentAwardCategory,
  );
  const {currentEvent} = useSelector(
    (state: RootState) => state.events,
  );
  const isEditMode = !!currentNomination?._id;
  const user = useSelector((state: RootState) => state.auth?.user);
  const [formData, setFormData] = useState({
    orgName: "",
    promoter: "",
    ownership: "",
    address: "",
    mobile: "",
    state: "",
    city: "",
    country: "",
    email: "",
    website: "",
    gstin: "",
    totalAmount: 6990,
    selectedAwards: [],
    paymentMode: "Online Banking",
    agreeTerms: false,
    researchPublication: [] as (File | string)[],
    bookPublication: [] as (File | string)[],
    researchProject: [] as (File | string)[],
    patentPolicyDocument: [] as (File | string)[],
    status: "pending",
    eventName: currentEvent?.basic?.title || "",
  });

  const [selectedAwards, setSelectedAwards] = useState<Record<string, string[]>>({
    academic: [],
    startup: [],
    rise: [],
    entrepreneur: [],
  });

  const [payableAmount, setPayableAmount] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);

  const [isDynamic, setIsDynamic] = useState(false);

  useEffect(() => {
    if (currentAwardCategory?.selectedAwards) {
      setDynamicCategories(currentAwardCategory?.selectedAwards)
      setIsDynamic(true);
    }
  }, [currentAwardCategory]);


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
        country: currentNomination.country ?? "",
        email: currentNomination.email ?? "",
        website: currentNomination.website ?? "",
        gstin: currentNomination.gstin ?? "",
        paymentMode: currentNomination.paymentMode ?? "Online Banking",
        agreeTerms: !!currentNomination.agreeTerms,
        researchPublication: currentNomination.researchPublication ?? [],
        bookPublication: currentNomination.bookPublication ?? [],
        researchProject: currentNomination.researchProject ?? [],
        patentPolicyDocument: currentNomination.patentPolicyDocument ?? [],
        status: currentNomination.status ?? "pending",
        eventName: currentNomination.eventName ?? "",
      }));
      setSelectedAwards({
        academic: currentNomination.academicAwards ?? [],
        startup: currentNomination.startupAwards ?? [],
        rise: currentNomination.riseAwards ?? [],
        entrepreneur: currentNomination.entrepreneurAwards ?? [],
      });
    }
  }, [currentNomination]);

  useEffect(() => {
    const selectedCount = Object.values(selectedAwards).flat().length;
    if (selectedCount === 0) {
      setPayableAmount(0);
    } else {
      const subtotal = selectedCount * BASE_FEE;
      const gst = subtotal * GST_RATE;
      const handling = selectedCount * HANDLING_PER_CAT;
      const total = Math.round(subtotal + gst + handling);
      setPayableAmount(total);
    }
  }, [selectedAwards]);

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

  const handleAwardChange = (
    category: string,
    award: string,
    checked: boolean,
  ) => {
    if (readOnly) return;
    setSelectedAwards((prev) => ({
      ...prev,
      [category]: checked
        ? [...(prev[category] || []), award]
        : (prev[category] || []).filter((a) => a !== award),
    }));
  };

  const handleDeleteFile = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };

  const showToast = (message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(
      () => setToast({ show: false, message: "", isError: false }),
      3500,
    );
  };

  const paymentHandler = (
    data: NominationFormType,
  ): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      const payamount = data?.totalAmount ? data.totalAmount * 100 : 6990;
      let options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: `${payamount}`,
        currency: "INR",
        name: "Acadivate",
        description: "Award Nomination",
        image: "https://acadivate.com/logo.png",
        order_id: (data as any).order?.id,
        handler: async function (response: any) {
          try {
            const orderData: OrderType = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: data?.totalAmount ?? 0,
              formId: data._id,
              status: "success",
            };
      
            const result = await saveOrderData(orderData);

            if (result.success) {
              showToast("Payment successful");
              resolve({ success: true });
            } else {
              showToast("Payment recorded but failed to update status", true);
              resolve({ success: false });
            }
          } catch (err) {
            showToast("Failed to process payment data", true);
            resolve({ success: false });
          }
        },
        modal: { ondismiss: () => resolve({ success: false }) },
        prefill: {
          name: data.promoter,
          email: data.email,
          contact: data.mobile,
        },
        theme: { color: "#2563eb" },
      };
      if (!(window as any).Razorpay) {
        showToast("Razorpay SDK failed to load.", true);
        resolve({ success: false });
        return;
      }
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    });
  };

  const saveOrderData = async (orderData: OrderType) => {
    try {
      const response = await dispatch(createOrderThunk(orderData)).unwrap();
  
      return { success: true, item: response };
    } catch (err) {
      console.error("Error saving order data:", err);
      return { success: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payableAmount === 0) {
      showToast("Select at least one award category", true);
      return;
    }
    setLoading(true);
    setLoadingStep("submitting");
    try {
      const formDataObj: NominationFormType = {
        orgName: formData.orgName,
        promoter: formData.promoter,
        ownership: formData.ownership,
        address: formData.address,
        mobile: formData.mobile,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        email: formData.email,
        website: formData.website,
        agreeTerms: formData.agreeTerms,
        gstin: formData.gstin,
        paymentMode: formData.paymentMode,
        academicAwards: selectedAwards.academic,
        startupAwards: selectedAwards.startup,
        riseAwards: selectedAwards.rise,
        entrepreneurAwards: selectedAwards.entrepreneur,
        researchPublication: formData.researchPublication.filter(
          (f) => typeof f === "string",
        ) as string[],
        bookPublication: formData.bookPublication.filter(
          (f) => typeof f === "string",
        ) as string[],
        researchProject: formData.researchProject.filter(
          (f) => typeof f === "string",
        ) as string[],
        patentPolicyDocument: formData.patentPolicyDocument.filter(
          (f) => typeof f === "string",
        ) as string[],
        status: isEditMode ? currentNomination?.status : "pending",
        totalAmount: payableAmount,
        submittedById: user?.userId,
        eventName: formData.eventName,
      };

      let response: any;
      if (isEditMode) {
        response = await dispatch(
          updateNominationThunk({ ...formDataObj, _id: currentNomination._id }),
        ).unwrap();
      } else {
        response = await dispatch(createNominationThunk(formDataObj)).unwrap();
      }
 

      if (response._id) {
        let paymentSuccessful = true;
        if (!isEditMode) {
          setLoadingStep("paying");
          console.log("response--->pay ment started");
          const paymentResult = await paymentHandler(response);
          console.log("response--->pay ment completed");
          paymentSuccessful = paymentResult.success;
        }
        if (paymentSuccessful) {
          setLoadingStep("uploading");

          const uploadResult = await uploadFiles({
            researchPublication: formData.researchPublication.filter(
              (f) => f instanceof File,
            ) as File[],
            bookPublication: formData.bookPublication.filter(
              (f) => f instanceof File,
            ) as File[],
            researchProject: formData.researchProject.filter(
              (f) => f instanceof File,
            ) as File[],
            patentPolicyDocument: formData.patentPolicyDocument.filter(
              (f) => f instanceof File,
            ) as File[],
            pathName: `/nomination-form/${response._id}`,
          });

          if (uploadResult.success) {
            // Merge existing strings with new uploaded URLs
            const mergedFiles: any = {};
            [
              "researchPublication",
              "bookPublication",
              "researchProject",
              "patentPolicyDocument",
            ].forEach((key) => {
              const fieldValue = formData[key as keyof typeof formData];
              const existing = Array.isArray(fieldValue)
                ? fieldValue.filter((f) => typeof f === "string")
                : [];
              const newlyUploaded = uploadResult.data[key] || [];
              mergedFiles[key] = [...existing, ...newlyUploaded];
            });

            const updatedNomination = { ...response, ...mergedFiles };

            const responseUpdate = await dispatch(
              updateNominationThunk(updatedNomination),
            ).unwrap();

            // Send Email Notification

            const responseMail = await sendEmailNotification(updatedNomination);

            showToast(
              isEditMode ? "Updated successfully!" : "Submitted successfully!",
            );
            router.back();
          } else {
            showToast("Data saved, but file upload failed.", true);
          }
        } else {
          showToast("Payment not completed.", true);
        }
        setLoading(false);
        setLoadingStep("");
      }
    } catch (error) {
      showToast("Error occurred. Please try again.", true);
      setLoading(false);
    }
  };

  const uploadFiles = async (data: any) => {
    console.log("Uploading files to:", data.pathName);
    const fd = new FormData();
    fd.append("pathName", data.pathName);
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value))
        value.forEach((file: File) => fd.append(key, file));
    });
    const res = await fetch("/api/uploadfile", { method: "POST", body: fd });
    const resposneUploadd = await res.json();

    return resposneUploadd;
  };

  const sendEmailNotification = async (updatedNomination: any) => {
    setLoadingStep("sending_email");
    try {
      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedNomination,
          academicAwards: selectedAwards.academic,
          startupAwards: selectedAwards.startup,
          riseAwards: selectedAwards.rise,
          entrepreneurAwards: selectedAwards.entrepreneur,
        }),
      });
      const emailData = await emailRes.json();
      if (emailData.success) {
      } else {
        showToast("Nomination saved, but email notification failed.", true);
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      showToast("Network error while sending email notification.", true);
    }
  };

  const handleDownloadPDF = async () => {
    const {
      researchPublication,
      bookPublication,
      researchProject,
      patentPolicyDocument,
      ...rest
    } = formData;
    await downloadNominationPDF({
      ...rest,
      academicAwards: selectedAwards.academic,
      startupAwards: selectedAwards.startup,
      riseAwards: selectedAwards.rise,
      entrepreneurAwards: selectedAwards.entrepreneur,
      totalAmount: payableAmount || formData.totalAmount,
    });
  };

  const renderAwardSection = (
    title: string,
    icon: React.ReactNode,
    awards: (string | any)[],
    category: string,
  ) => (
    <div className={styles["categories-section"]}>
      <div className={styles["section-title"]}>
        {icon} {title}
      </div>
      <div className={styles["cat-grid"]}>
        {awards?.map((awardItem) => {
          const awardName =
            typeof awardItem === "string" ? awardItem : awardItem.name;
          return (
            <div key={awardName} className={styles["cat-item"]}>
              <input
                type="checkbox"
                checked={selectedAwards[category]?.includes(awardName) || false}
                onChange={(e) =>
                  handleAwardChange(category, awardName, e.target.checked)
                }
                disabled={readOnly}
                id={`${category}-${awardName}`}
              />
              <label htmlFor={`${category}-${awardName}`}>{awardName}</label>
            </div>
          );
        })}
      </div>
    </div>
  );

  const NominationFileItem = ({
    file,
    idx,
    field,
    label,
  }: {
    file: File | string;
    idx: number;
    field: keyof typeof formData;
    label: string;
  }) => {
    const isExisting = typeof file === "string";
    const fileName = isExisting
      ? (file as string).split("/").pop()
      : (file as File).name;
    const fileUrl = isExisting
      ? (file as string)
      : URL.createObjectURL(file as File);
    const [downloading, setDownloading] = useState(false);

    const onDownload = async () => {
      if (isExisting) {
        setDownloading(true);
        try {
          await downloadFile(file as string, `${label}_${idx + 1}.pdf`);
        } finally {
          setDownloading(false);
        }
      }
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.75rem",
          background: "#f1f5f9",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            color: "#334155",
            maxWidth: "70%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {fileName}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          {isExisting ? (
            downloading ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Download
                size={16}
                style={{ cursor: "pointer", color: "#2563eb" }}
                onClick={onDownload}
              />
            )
          ) : (
            <Eye
              size={16}
              style={{ cursor: "pointer", color: "#64748b" }}
              onClick={() => window.open(fileUrl)}
            />
          )}
          {!readOnly && (
            <Trash2
              size={16}
              style={{ cursor: "pointer", color: "#ef4444" }}
              onClick={() => handleDeleteFile(field, idx)}
            />
          )}
        </div>
      </div>
    );
  };

  const renderFileField = (label: string, field: keyof typeof formData) => (
    <div className={styles["input-group"]}>
      <label>{label} (PDF Only)</label>
      <input
        type="file"
        name={field}
        accept="application/pdf"
        multiple
        onChange={handleInputChange}
        disabled={readOnly}
      />
      {(formData[field] as (File | string)[]).length > 0 && (
        <div
          style={{
            marginTop: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {(formData[field] as (File | string)[]).map((file, idx) => (
            <NominationFileItem
              key={idx}
              file={file}
              idx={idx}
              field={field}
              label={label}
            />
          ))}
        </div>
      )}
    </div>
  );

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
      country: "India",
      email: "test@acadivate.com",
      website: "https://acadivate.com",
      gstin: "27AAAAA0000A1Z5",
      paymentMode: "Online Banking",
      agreeTerms: true,
      eventName: currentEvent?.basic?.title || "",
    }));
  };
  return (
    <>
      <Suspense fallback={null}>
        <GetNominationAwards />
        <GetEventBySlug/>
      </Suspense>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles["hero-badge"]}>
            <Trophy
              size={14}
              style={{ verticalAlign: "middle", marginRight: "6px" }}
            />{" "}
            Nominations Are Open
          </div>
          <h1>
            <Award size={40} color="#2563eb" /> Award Registration
          </h1>
          <p className={styles.subhead}>
            Kindly fill in the form below to nominate for awards. Select one or
            more categories that best represent your achievement.
          </p>
        </div>

        <div className={styles["form-card"]}>
          <div className={styles["form-header"]}>
            <h2>
              <FileText /> Nomination Form
            </h2>
            <p>
              Registration fee applies per selected category. Please provide
              accurate details.
            </p>
          </div>
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

          <form onSubmit={handleSubmit}>
            <div className={styles["form-grid"]}>
              <div
                className={`${styles["input-group"]} ${styles["full-width"]}`}
              >
                <label>
                  <Building2 size={16} /> Name of the Organization
                </label>
                <input
                  type="text"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleInputChange}
                  placeholder="Enter Organization Name"
                  required
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <User size={16} /> Name of the promoter
                </label>
                <input
                  type="text"
                  name="promoter"
                  value={formData.promoter}
                  onChange={handleInputChange}
                  placeholder="Enter Promoter Name"
                  required
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Globe size={16} /> Ownership Pattern
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
                  ].map((opt) => (
                    <label key={opt}>
                      <input
                        type="radio"
                        name="ownership"
                        value={opt}
                        checked={formData.ownership === opt}
                        onChange={handleInputChange}
                        disabled={readOnly}
                      />{" "}
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div
                className={`${styles["input-group"]} ${styles["full-width"]}`}
              >
                <label>
                  <MapPin size={16} /> Address of Correspondence
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full correspondence address"
                  required
                  disabled={readOnly}
                  rows={3}
                ></textarea>
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Phone size={16} /> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  required
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Mail size={16} /> Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Globe size={16} /> State
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
                  <option>Rajasthan</option>
                  <option>Uttar Pradesh</option>
                  <option>Punjab</option>
                  <option>Haryana</option>
                  <option>Others</option>
                </select>
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Building size={16} /> City
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
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Kolkata</option>
                  <option>Ahmedabad</option>
                  <option>Jaipur</option>
                  <option>Lucknow</option>
                  <option>Chandigarh</option>
                  <option>Others</option>
                </select>
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Globe size={16} /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter Country"
                  required
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <Globe size={16} /> Website URL
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://"
                  disabled={readOnly}
                />
              </div>

              <div className={styles["input-group"]}>
                <label>
                  <FileText size={16} /> GSTIN
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

              {renderFileField("Research Publication", "researchPublication")}
              {renderFileField("Book Publication", "bookPublication")}
              {renderFileField("Research Project", "researchProject")}
              {renderFileField("Patent Policy", "patentPolicyDocument")}
            </div>

            <hr
              style={{
                margin: "2rem 0",
                border: "none",
                borderTop: "1px solid #e2e8f0",
              }}
            />

            {isDynamic ? (
              dynamicCategories.map((cat, idx) => (
                <React.Fragment key={idx}>
                  {renderAwardSection(
                    cat.title,
                    cat.icon,
                    cat.items,
                    cat.key as keyof typeof selectedAwards,
                  )}
                </React.Fragment>
              ))
            ) : (
            <Loader2/>
              
              // <>
              //   {renderAwardSection(
              //     "Academic Awards",
              //     <Trophy size={20} color="#fbbf24" />,
              //     academicAwards,
              //     "academic",
              //   )}
              //   {renderAwardSection(
              //     "Startup Awards",
              //     <Globe size={20} color="#3b82f6" />,
              //     startupAwards,
              //     "startup",
              //   )}
              //   {renderAwardSection(
              //     "Rise Awards",
              //     <Award size={20} color="#10b981" />,
              //     riseAwards,
              //     "rise",
              //   )}
              //   {renderAwardSection(
              //     "Entrepreneur Awards",
              //     <User size={20} color="#8b5cf6" />,
              //     entrepreneurAwards,
              //     "entrepreneur",
              //   )}
              // </>
            )}

            <div className={styles["fee-summary"]}>
              <div className={styles["fee-block"]}>
                <div className={styles["fee-item"]}>
                  <span>Categories Selected</span>
                  <strong>{Object.values(selectedAwards).flat().length}</strong>
                </div>
                <div className={styles["fee-item"]}>
                  <span>Fee per Category</span>
                  <strong>₹{BASE_FEE}</strong>
                </div>
                <div className={styles["fee-item"]}>
                  <span>GST (18%)</span>
                  <strong>
                    ₹
                    {Math.round(
                      Object.values(selectedAwards).flat().length *
                        BASE_FEE *
                        GST_RATE,
                    )}
                  </strong>
                </div>
              </div>
              <div className={styles.payable}>
                <span>Total Payable Amount</span>
                <strong>₹{payableAmount}</strong>
              </div>
            </div>

            <div
              style={{
                margin: "1.5rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                name="agreeTerms"
                required
                disabled={readOnly}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#2563eb",
                }}
              />
              <label
                htmlFor="terms"
                style={{
                  fontSize: "0.9rem",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                I agree to the terms and conditions of Acadivate Awards.
              </label>
            </div>

            <div className={styles["btn-row"]}>
              <button
                type="submit"
                className={styles["btn-submit"]}
                disabled={loading || readOnly}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {loadingStep === "paying"
                      ? "Awaiting Payment..."
                      : "Processing..."}
                  </>
                ) : (
                  <>
                    Complete Registration <Check size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className={styles["btn-pdf"]}
              >
                <Download size={18} /> Download Form PDF
              </button>

              <button
                type="button"
                onClick={() => {
                  dispatch(setCurrentNomination(null));
                  router.back();
                }}
                className={styles["btn-close"]}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast.show && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: toast.isError ? "#ef4444" : "#1e293b",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: 600,
            animation: "slideIn 0.3s ease",
          }}
        >
          {toast.isError ? (
            <X size={20} />
          ) : (
            <Check size={20} color="#10b981" />
          )}
          {toast.message}
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default NominationForm;
