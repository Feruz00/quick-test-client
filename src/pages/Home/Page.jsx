import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Home | Quick test';
  }, []);
  return <div>Page</div>;
};

export default HomePage;
