import { useState } from "react";
import { resetMatch, startMatch, updateScore } from "../services";
import Grid from '@mui/material/Grid';
import {
  Container,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

const Home = () => {
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  let port;
  try {
    port = window.location.port;
  } catch (error) {
    console.error("An error occurred while retrieving the port:", error);
  }

  // assume user apps are in ports 3101 and 3102
  const cid = port === "3101" ? 1 : 2;

  const handleStartMatch = async () => {
    try {
      const data = await startMatch(cid) 
      // setMessage(data.message);
      setMessage("MATCH STARTED");
      setIsMatchStarted(true);
    } catch (error) {
      console.log(error.message)
      setMessage("Error starting match");
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  const handleUpdateScore = async (increment) => {
    try {
      const data = updateScore(cid, increment, false)
      // setMessage(data.message);
      setMessage("Scored " + increment + " runs");
    } catch (error) {
      console.log(error.message)
      setMessage("Error updating score");
    }
  };

  const handleWicket = async () => {
    try {
      const data = updateScore(cid, 0, true)
      // setMessage(data.message);
      setMessage("Get Outta Here");
    } catch (error) {
      console.log(error.message)
      setMessage("Error updating wicket");
    }
  };

  const handleWide = async () => {
    try {
      const data = await updateScore(cid, 1, false, true);
      setMessage("Wide ball, 1 run");
    } catch (error) {
      console.log(error.message);
      setMessage("Error updating wide ball");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmResetMatch = async () => {
    try {
      const data = await resetMatch(cid)
      setMessage("");
      setIsMatchStarted(false);
    } catch (error) {
      console.log(error.message)
      setMessage("Error reseting match");
    } 
    finally {
      // setLoading(false);
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="font-mono p-6 text-center text-2xl text-bold">
        Phoenix Cric App
      </div>

      {!isMatchStarted ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartMatch}
          fullWidth
        >
          Start Match
        </Button>
      ) : (
        <Box sx={{
          mt: 1, display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Grid container spacing={2} justifyContent="center">
            {[1, 2, 3, 4, 6].map((increment) => (
              <Grid item xs={4} sm={3} key={increment}>
                <Card sx={{ height: 100, backgroundColor: "#2e2e2e", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleUpdateScore(increment)}>
                  <CardContent>
                    <Typography variant="h5" align="center" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      {increment}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            <Grid item xs={4} sm={3}>
              <Card
                sx={{ height: 100, backgroundColor: "#2c3e50", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleWide}
              >
                <CardContent>
                  <Typography variant="h5" align="center" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Wide
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} sm={3}>
              <Card 
                sx={{ height: 100, backgroundColor: "#e91e63", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                onClick={handleWicket}
              >
                <CardContent>
                  <Typography variant="h5" align="center" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Wicket
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {message && (
            <div className="font-mono py-6 text-center text-lg">
              {message}
            </div>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenDialog}
            fullWidth
            sx={{ mt: 4 }}
          >
            Reset Match
          </Button>
          
          {/* Dialog Box for reset Confirmation */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Reset</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to reset the match? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmResetMatch} variant="outlined" color="secondary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      )}
    </Container>
  );
};

export default Home;
