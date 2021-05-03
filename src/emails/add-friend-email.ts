import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addFriendEmail = (email: string, userId: string) => ({
  to: email, // Change to your recipient
  from: 'listu.hello@gmail.com', // Change to your verified sender
  subject: 'Your friends are inviting you to use Listu!',
  html: `
    <h3>Your friends want you to come try Listu! </h3>
    <p>
      Please finish registering following this link: ${config.clientUrl}/new-friend/${userId}
    </p>

    <h4>Best, from the Listu team :) </h4>
  `,
});
