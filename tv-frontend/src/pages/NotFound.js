import { useEffect, useState } from 'react';

const NotFound = () => {
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   fetch('/api/hello')
  //     .then(response => response.text())
  //     .then(data => setMessage(data))
  //     .catch(error => console.error('Error fetching message:', error));
  // }, []);

  return (
    <div className="bg-gray-100 p-1">
      {message ? (
        <div>{message}</div>
      ) : (
        <div className="bg-gray-400">404 Page Not Found</div>
      )}
    </div>
  );
};

export default NotFound;
