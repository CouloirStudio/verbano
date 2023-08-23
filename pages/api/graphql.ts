import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Placeholder for your GraphQL server setup
  res.status(200).json({ message: 'Hello from GraphQL!' });
}

export default handler;
