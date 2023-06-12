import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <Link href="/page2" passHref>
        <button>Go to Page 2</button>
      </Link>
    </div>
  );
};

export default Home;
