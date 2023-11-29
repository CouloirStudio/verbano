import { Router } from 'express';
import { User } from '@/app/models/User';
import EmailService from '@/app/services/EmailService';

const router = Router();

/**
 * Endpoint for user account transfer.
 */
router.get('/:transferCode', async (req, res) => {
  const transferCode = req.params.transferCode;

  if (!transferCode) {
    return res.status(400).send('Transfer code is required');
  }

  try {
    let revert = false;
    let user = await User.findOne({ 'emailTransfer.code': transferCode });

    if (!user) {
      user = await User.findOne({ 'emailTransfer.revertCode': transferCode });

      if (!user) {
        return res.status(404).send('User not found');
      }
      revert = true;
    }

    if (!user.emailTransfer) {
      return res.status(400).send('No new email transfer request found.');
    }

    if (revert) {
      user.email = user.emailTransfer.oldEmail;
      user.emailTransfer = undefined;
      await user.save();
      return res.redirect('/');
    }

    const transferRequestedAt = user.emailTransfer.requestedAt;
    if (!transferRequestedAt) {
      return res.status(400).send('Invalid request time found');
    }

    const currentTime = new Date();
    const hoursDiff =
      Math.abs(currentTime.getTime() - transferRequestedAt.getTime()) / 36e5;

    if (hoursDiff > 24) {
      user.emailTransfer = undefined;
      return res.status(400).send('Transfer code expired');
    }
    const emailRevertCode = crypto.randomUUID();

    user.emailTransfer = {
      code: undefined,
      revertCode: emailRevertCode,
      newEmail: user.emailTransfer.newEmail,
      oldEmail: user.emailTransfer.oldEmail,
    };
    user.email = user.emailTransfer.newEmail;
    await user.save();

    // Generate a new revert code
    const activationUrl = `https://localhost:3000/transfer/${encodeURIComponent(
      emailRevertCode,
    )}`;

    const emailHtml = `
        <p>Your account has been transferred to ${user.email}, to revert the change, click the following link.</p>
        <a href="${activationUrl}">Undo Account Transfer</a>
        <p>(If you didn't request the change, change your passwords!)</p>
        `;

    await EmailService.sendMail(
      user.emailTransfer.oldEmail,
      'Your Account Has Been Transferred',
      emailHtml,
    );

    return res.redirect('/');
  } catch (error) {
    console.error('Transfer error:', error);
    return res.status(500).send('Internal server error');
  }
});

// Export the router
export default router;
