import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends an order confirmation email to the user.
 * @param {Object} orderData 
 */
export const sendOrderConfirmation = async (orderData) => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn("EmailJS credentials are not fully set in .env");
      return false;
    }

    const templateParams = {
      to_name: orderData.customerName || "Customer",
      to_email: orderData.customerEmail,
      order_id: orderData.id || "Pending",
      total_amount: orderData.total,
      delivery_address: orderData.deliveryAddress,
      delivery_option: orderData.deliveryOption,
      pay_method: orderData.payMethod?.replace('_', ' ').toUpperCase(),
      message: `Your order has been placed successfully. ${orderData.hasInstallmentItems ? "Since you have chosen an installment plan, please log in to your dashboard to track your upcoming payments." : ""}`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return response.status === 200;
  } catch (error) {
    console.error("Failed to send order email:", error);
    return false;
  }
};
