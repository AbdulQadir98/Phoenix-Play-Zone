import React from 'react';

const Notification = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="text-center">
        <div className="text-4xl text-gray-600 mb-4">No Notifications</div>
        <div className="text-lg">You're all caught up! Check back later for any updates.</div>
      </div>
    </div>
  );
};

export default Notification;
