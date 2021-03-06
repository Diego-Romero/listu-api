import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const resetPasswordEmail = (email: string, token: string) => ({
  to: email, // Change to your recipient
  from: 'listu.hello@gmail.com', // Change to your verified sender
  subject: 'Listu - Reset Password',
  html: `
    <p>
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
    </p>
    <p>
      Please click on the following link, or paste this into your browser to complete the process: ${config.clientUrl}/password-reset/${token}
    </p>
    <p>
      If you did not request this, please ignore this email and your password will remain the same.
    </p>
  `,
});
