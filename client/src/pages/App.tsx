import React from 'react';
import Link from 'next/link';
import PlaceholderPage1 from './page2';

const App: React.FC = () => {
  // Next.js will handle routing, so we just render the main content.
  return (
    <div>
      <h1>Hello Verbano</h1>
      <Link href="/page2" passHref>
        <button>Go to Page 2</button>
      </Link>
      <PlaceholderPage1 />
    </div>
  );
};

export default App;
