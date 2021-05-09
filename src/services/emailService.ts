import sgMail from '@sendgrid/mail';
import config from '../config/config';
import { addFriendEmail } from '../emails/add-friend-email';
import { addedToListEmail } from '../emails/added-to-list-email';
import { contactMessageEmail } from '../emails/contact-message-email';
import { resetPasswordEmail } from '../emails/reset-password-email';

sgMail.setApiKey(config.sendGridApiKey as string);

export class EmailService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendAddFriendNewUserEmail(email: string, userId: string) {
    return sgMail.send(addFriendEmail(email, userId));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendAddedToListEmail(email: string, listName: string) {
    return sgMail.send(addedToListEmail(email, listName));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendResetPasswordEmail(email: string, token: string) {
    return sgMail.send(resetPasswordEmail(email, token));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  sendContactMessageEmail(message: string, email: string) {
    return sgMail.send(contactMessageEmail(message, email));
  }
}
