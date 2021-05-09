// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const contactMessageEmail = (message: string, email: string) => ({
  to: 'dev.diego.romero@gmail.com', // Change to your recipient
  from: 'listu.hello@gmail.com', // Change to your verified sender
  subject: `New message from ${email}`,
  html: `
    <h3>Email from contact form</h3>
    <br>
    <p>
    ${message}
    </p>
  `,
});
