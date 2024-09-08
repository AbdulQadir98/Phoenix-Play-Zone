import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Restaurant = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="text-center">
          <AccessTimeIcon className="text-9xl text-gray-500 mb-4" />
          <Typography variant="h4" component="h2" className="font-bold text-gray-800 mb-2">
            Restaurant Coming Soon
          </Typography>
          <Typography variant="body1" component="p" className="text-gray-600">
            We're working to bring you an amazing dining experience. Stay tuned for updates!
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Restaurant;
