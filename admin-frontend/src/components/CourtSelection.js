// CourtSelection.js
import { Card, CardContent, Typography, Button } from '@mui/material';

const courts = [
  { id: 1, name: 'Futsal Court 1', description: "(Entrance Futsal Court)", normalPrice: 3000, peakPrice: 4000 },
  { id: 2, name: 'Futsal Court 2', description: "(Outer Futsal Court)", normalPrice: 3000, peakPrice: 4000 },
  { id: 3, name: 'Badminton Court', description: "(Indoor Badminton Court)", normalPrice: 800, peakPrice: 1000 },
  { id: 4, name: 'Leather Court 1', description: "(Machine Leather Court)", normalPrice: 2250, peakPrice: 2250 },
  { id: 5, name: 'Leather Court 2', description: "(Normal Leather Court)", normalPrice: 1250, peakPrice: 1250 },
];

const CourtSelection = ({ onSelectCourt }) => {
  const handleCourtSelect = (court) => {
    onSelectCourt({
      id: court.id,
      name: court.name,
      normalPrice: court.normalPrice,
      peakPrice: court.peakPrice,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      {courts.map((court) => (
        <Card
          key={court.id}
          className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
          sx={{ maxWidth: 350, backgroundColor: '#E5E7EB' }}
        >
          <CardContent className="text-center p-4">
            <Typography variant="h5" gutterBottom className="font-semibold text-gray-800">
              {court.name}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-500" sx={{marginBottom: '10px'}}>
              {court.description}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Normal: {court.normalPrice} LKR
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Peak: {court.peakPrice} LKR
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className="mt-4"
              sx={{ marginTop: '15px' }}
              onClick={() => handleCourtSelect(court)}
            >
              Select
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourtSelection;
