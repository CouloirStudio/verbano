import React from 'react';
import Link from 'next/link';

const Page2: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Page 2</h1>
      <Link href="/" passHref>
        <button>Go to Home</button>
      </Link>
    </div>
  );
};

export default Page2;
