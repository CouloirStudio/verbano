import { UserMutations } from '@/app/graphql/resolvers/UserResolvers';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if the user is authenticated.
 * In a test environment, it allows all requests.
 * In other environments, it redirects unauthenticated users to the login page,
 * and prevents authenticated users from accessing the login or register pages.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the application's request-response cycle.
 */
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  if (req.user) {
    if (['/login', '/register'].includes(req.path)) {
      return res.redirect('/');
    }
    return next();
  }

  if (['/graphql'].includes(req.path) || req.path.startsWith('/_next')) {
    return next();
  }

  if (!['/login', '/register'].includes(req.path)) {
    res.redirect('/login');
  } else {
    next();
  }
}

/**
 * Handles user logout process. It attempts to log out the user
 * and redirects to the home page upon successful logout.
 * If logout fails, it sends a 500 server error response.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function handleLogout(req: Request, res: Response): Promise<void> {
  try {
    const result = await UserMutations.logout({ req });
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

/**
 * Middleware for testing authentication status.
 * Sends a 200 OK response if the user is authenticated, or a 401 Unauthorized response otherwise.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export function authCheckTestMiddleware(req: Request, res: Response): void {
  if (req.user) {
    res.status(200).send('Authenticated');
  } else {
    res.status(401).send('Unauthorized');
  }
}
