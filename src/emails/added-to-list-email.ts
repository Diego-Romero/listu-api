// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addedToListEmail = (email: string, listName: string) => ({
  to: email, // Change to your recipient
  from: 'listu.hello@gmail.com', // Change to your verified sender
  subject: 'You have been added to a new list!',
  html: `
    You have just been added to a new list: ${listName}. Login into the platform to see what your friends are listing :)
  `,
});
