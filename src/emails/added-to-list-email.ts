import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addedToListEmail = (email: string, listName: string) => ({
  to: email, // Change to your recipient
  from: 'listu.hello@gmail.com', // Change to your verified sender
  subject: 'Listu: you have been invited to join your friend list',
  html: `
    <h4>You have been added to a new list: ${listName}</h4>
    <p>
      Log into Listu to see what your friends are adding: ${config.clientUrl}/lists
    </p>
    <h5>Best</h5>
  `,
});
