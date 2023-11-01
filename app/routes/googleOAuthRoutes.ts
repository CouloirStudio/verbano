import { Router } from 'express';
import passport from '@/app/config/passport';

const router = Router();

router.get(
  '/auth/google',
  passport.authenticate('google', {
    prompt: 'select_account',
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