import NominationForm from "@/src/components/forms/Nomination/NominationForm";
import Script from "next/script";
import React from "react";

const page = () => {
  return (
    <div>
      <NominationForm />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
    </div>
  );
};

export default page;
