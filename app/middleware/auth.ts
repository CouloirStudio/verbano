import { UserMutations } from '@/app/graphql/resolvers/UserResolvers';

interface AuthContext {
  req: {
    headers: {
      authorization?: string;
    };
  };
}

export function isAuthenticated(req: any, res: any, next: any) {
  // If test environment, skip authentication
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  // If user is authenticated
  if (req.user) {
    // Prevent authenticated users from accessing /login or /register
    if (['/login', '/register'].includes(req.path)) {
      return res.redirect('/'); // Redirect to home or another suitable page
    }
    return next();
  }

  // Allow certain paths without authentication
  if (['/graphql'].includes(req.path) || req.path.startsWith('/_next')) {
    return next();
  }

  // If not authenticated and not already on /login or /register, redirect to /login
  if (!['/login', '/register'].includes(req.path)) {
    res.redirect('/login');
  } else {
    next(); // If already on /login or /register, continue without redirecting
  }
}

export async function handleLogout(req: any, res: any) {
  try {
    const result = await UserMutations.logout(null, null, { req });
    if (result) {
      res.redirect('/');
    } else {
      res.status(500).send('Failed to logout');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during logout');
  }
}

export function authCheckTestMiddleware(req: any, res: any, next: any) {
  if (req.user) {
    res.status(200).send('Authenticated');
  } else {
    res.status(401).send('Unauthorized');
  }
}
