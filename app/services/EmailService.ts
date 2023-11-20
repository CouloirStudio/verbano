import nodemailer, { Transporter } from 'nodemailer';

/**
 * Email service
 *
 * This service is used to send emails to users
 */
class EmailService {
  private transporter: Transporter;

  /**
   * Constructs a new instance of the `EmailService`.
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'verbanotest@gmail.com',
        pass: 'goutsequlqxyxvnk',
      },
    });
  }

  /**
   * Sends an email to the given address.
   * @param to The email address to send the email to
   * @param subject The subject of the email
   * @param html The HTML content of the email
   */
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'Verbano',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default new EmailService();
