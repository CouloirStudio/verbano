import { Router } from 'express';
import { User } from '@/app/models/User';

const router = Router();

// Activation route
router.get('/:activationCode', async (req, res) => {
  const activationCode = req.params.activationCode;

  if (!activationCode) {
    return res.status(400).send('Activation code is required');
  }

  try {
    const user = await User.findOne({ activationCode: activationCode });

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.active) {
      return res.status(400).send('User already activated');
    }

    user.active = true;
    await user.save();

    return res.redirect(
      '/login?message=' +
        encodeURIComponent('Account activated successfully. Please login.'),
    );
  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).send('Internal server error');
  }
});

// Export the router
export default router;
