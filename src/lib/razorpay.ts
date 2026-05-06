import { NominationFormType } from "@/src/hook/nominations/nominationType";
import { OrderType } from "@/src/hook/orders/orderType";
import { createOrderThunk } from "@/src/hook/orders/orderThunk";
import { AppDispatch } from "@/src/hook/store";

/**
 * Generic interface for Razorpay payment configuration
 */
export interface RazorpayPaymentOptions {
  amount: number;
  orderId: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

/**
 * A proper, reusable function to handle Razorpay payments.
 * This can be used in any project by passing the required configuration and callbacks.
 */
export const openRazorpay = (
  options: RazorpayPaymentOptions,
  onSuccess: (response: any) => Promise<void> | void,
  onCancel: () => void,
  showToast: (message: string, isError?: boolean) => void
): void => {
  if (!(window as any).Razorpay) {
    showToast("Razorpay SDK failed to load. Please refresh the page.", true);
    return;
  }

  const rzpOptions: any = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: Math.round(options.amount * 100), // Convert to paise
    currency: "INR",
    name: "Acadivate",
    description: options.description || "Payment",
    image: "https://acadivate.com/logo.png",
    order_id: options.orderId,
    handler: onSuccess,
    modal: {
      ondismiss: onCancel,
    },
    prefill: options.prefill,
    theme: { color: "#2563eb" },
  };

  const rzp = new (window as any).Razorpay(rzpOptions);
  rzp.open();
};

/**
 * Specific helper for the current project to save order data via Redux
 */
export const saveOrderData = async (
  orderData: OrderType,
  dispatch: AppDispatch
) => {
  try {
    const response = await dispatch(createOrderThunk(orderData)).unwrap();
    return { success: true, item: response };
  } catch (err) {
    console.error("Error saving order data:", err);
    return { success: false };
  }
};

/**
 * The specific handler for Nomination Forms (Project-specific wrapper)
 */
export const nominationPaymentHandler = (
  data: NominationFormType,
  dispatch: AppDispatch,
  showToast: (message: string, isError?: boolean) => void
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    openRazorpay(
      {
        amount: data.totalAmount || 69.90,
        orderId: (data as any).order?.id,
        description: "Award Nomination",
        prefill: {
          name: data.promoter,
          email: data.email,
          contact: data.mobile,
        },
      },
      async (response: any) => {
        const orderData: OrderType = {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: data.totalAmount ?? 0,
          formId: data._id,
          status: "success",
        };

        const result = await saveOrderData(orderData, dispatch);
        if (result.success) {
          showToast("Payment successful");
          resolve({ success: true });
        } else {
          showToast("Payment recorded but failed to update status", true);
          resolve({ success: false });
        }
      },
      () => resolve({ success: false }), // On Cancel
      showToast
    );
  });
};
