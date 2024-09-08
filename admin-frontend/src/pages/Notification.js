import React from 'react';

const Notification = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative z-10 text-center">
        <h1 className="text-4xl mb-4">No Notifications</h1>
        <p className="text-lg">You're all caught up! Check back later for any updates.</p>
      </div>
    </div>
  );
};

export default Notification;
