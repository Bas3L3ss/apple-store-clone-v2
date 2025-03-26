import { EmailSubject } from "../@types";
import { sendEmail } from "./nodemailer";

// Dynamic email templates using template literals
const emailTemplates: Record<EmailSubject, (data: any) => string> = {
  "Payment Succeeded": ({
    orderId,
    shippingAddress,
    estimatedDelivery,
    total,
  }) => `
    <h1>Payment Succeeded</h1>
    <p>Your order #${orderId} to <em>${shippingAddress}</em> status has been confirmed: costs <strong>$${total.toFixed(
    2
  )}</strong>.</p>
    <p>Your order will be delivered in <strong>${estimatedDelivery}</strong>. </p>
  `,
  "User Logged In": ({ ip, device }) => `
    <h1>Security Alert: New Login Detected</h1>
    <p>We noticed a login to your account from a new device.</p>
    <p><strong>IP Address:</strong> ${ip}</p>
    <p><strong>Device:</strong> ${device}</p>
    <p>If this was you, you can ignore this message. If not, please secure your account immediately. Or contact support</p>
  `,
  "Order Status Changed": ({ orderId, status }) => `
    <h1>Order Update</h1>
    <p>Your order #${orderId} status has been updated to: <strong>${status}</strong>.</p>
  `,
};

export async function handleEmailMessage(message: string) {
  try {
    const parsedMessage = JSON.parse(message);
    const { subject, email, data } = parsedMessage;

    if (!subject || !email || !data) {
      console.error("Invalid message format", message);
      return;
    }

    if (!(subject in emailTemplates)) {
      console.error("Invalid email subject", subject);
      return;
    }

    const htmlContent = emailTemplates[subject as EmailSubject](data);
    await sendEmail(htmlContent, email, subject);
    console.log(`Email sent to ${email} with subject: ${subject}`);
  } catch (error) {
    console.error("Error handling email message", error);
  }
}
