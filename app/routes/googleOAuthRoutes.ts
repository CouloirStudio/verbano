import { Router } from 'express';
import passport from '@/app/config/passport';

/**
 * Router for Google Oauth endpoints.
 */
const router = Router();
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    accessType: 'offline',
    prompt: 'consent',
  }),
);

router.get('/auth/google/callback', function (req, res, next) {
  passport.authenticate('google', function (err: any, user: any, info: any) {
    if (err) {
      return res.redirect('/login?error=' + encodeURIComponent(err.message));
    }
    if (!user) {
      return res.redirect('/login?error=' + encodeURIComponent(info.message));
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.redirect('/login?error=' + encodeURIComponent(err.message));
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

export default router;
