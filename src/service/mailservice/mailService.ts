import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "eda6e6a683da9d",
    pass: process.env.nodemailer_password,
  },
});

export const createSuccessEmailTemplate = (
  order: any,
  customer_name: any,
  products: any
) => {
  const productList = products
    .map(
      (p: any) =>
        `<li>${p.name || "Product"} - Quantity: ${p.quantity} - Price: $${
          p.price
        }</li>`
    )
    .join("");

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">Order Confirmation - Order #${order._id}</h2>
          <p>Dear ${customer_name},</p>
          <p>Thank you for your order! Your payment has been processed successfully.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Status:</strong> ${order.order_status}</p>
            <p><strong>Total Amount:</strong> $${order.total_amount}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Products Ordered:</h3>
            <ul>${productList}</ul>
          </div>

          <p>Your order is now being processed and will be shipped soon. You will receive a tracking number once your order is dispatched.</p>
          <p>Thank you for shopping with us!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const createFailureEmailTemplate = (
  order: any,
  customer_name: any,
  reason: any
) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc3545;">Order Processing Issue - Order #${order._id}</h2>
          <p>Dear ${customer_name},</p>
          <p>We're sorry to inform you that there was an issue processing your order.</p>
          
          <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Status:</strong> ${order.order_status}</p>
            <p><strong>Issue:</strong> ${reason}</p>
          </div>

          <p>Please try placing your order again, or contact our customer support if you continue to experience issues.</p>
          <p>We apologize for any inconvenience caused.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply to this email.</p>
            <p style="font-size: 12px; color: #666;">For support, please contact us at support@yourstore.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Send email function
export const sendEmail = async (to: any, subject: any, htmlContent: any) => {
  try {
    const mailOptions = {
      from: '"Your Store" <noreply@yourstore.com>',
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};
