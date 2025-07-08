interface EmailTemplateData {
  userEmail: string;
  timestamp: string;
}

export const EMAIL_TEMPLATES = {
  /**
   * Test email template - used for testing email functionality
   */
  TEST_EMAIL: (data: EmailTemplateData) => ({
    subject: '🚀 Test Email from ExpoBase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">🎉 Email Test Successful!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Congratulations! Your email notification system is working perfectly.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          This test email was sent from your ExpoBase app using the Resend API.
        </p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333; font-weight: bold;">Test Details:</p>
          <p style="margin: 5px 0; color: #666;">Sent to: ${data.userEmail}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${data.timestamp}</p>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          ExpoBase - Your React Native Starter Kit
        </p>
      </div>
    `,
  }),

  /**
   * Welcome email template - for new user registration
   */
  WELCOME_EMAIL: (data: { userName: string; userEmail: string }) => ({
    subject: '🎉 Welcome to ExpoBase!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to ExpoBase!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Hi ${data.userName || 'there'},
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Welcome to ExpoBase! We're excited to have you on board.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Your account has been successfully created with the email: ${data.userEmail}
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Get Started
          </a>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          ExpoBase - Your React Native Starter Kit
        </p>
      </div>
    `,
  }),

  /**
   * Password reset email template
   */
  PASSWORD_RESET_EMAIL: (data: { resetLink: string; userEmail: string; expirationTime: string }) => ({
    subject: '🔐 Reset Your Password - ExpoBase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          We received a request to reset your password for your ExpoBase account.
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          Click the button below to reset your password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          This link will expire on ${data.expirationTime}. If you didn't request this password reset, please ignore this email.
        </p>
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          ExpoBase - Your React Native Starter Kit
        </p>
      </div>
    `,
  }),

  /**
   * Notification email template - for general notifications
   */
  NOTIFICATION_EMAIL: (data: { title: string; message: string; userEmail: string; actionUrl?: string; actionText?: string }) => ({
    subject: `📧 ${data.title} - ExpoBase`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">${data.title}</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.5;">
          ${data.message}
        </p>
        ${data.actionUrl && data.actionText ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.actionUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              ${data.actionText}
            </a>
          </div>
        ` : ''}
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          ExpoBase - Your React Native Starter Kit
        </p>
      </div>
    `,
  }),
} as const;

export type EmailTemplateType = keyof typeof EMAIL_TEMPLATES; 