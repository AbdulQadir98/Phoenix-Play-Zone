import { useState } from "react";
import { resetMatch, startMatch, updateScore, undoScore } from "../services";
import Grid from '@mui/material/Grid';
import UndoIcon from '@mui/icons-material/Undo';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  let port;
  try {
    port = window.location.port;
  } catch (error) {
    console.error("An error occurred while retrieving the port");
  }

  // assume user apps are in ports 3101 and 3102
  const cid = port === "3101" ? 1 : 2;

  const handleStartMatch = async () => {
    try {
      await startMatch(cid);
      setMessage("MATCH STARTED");
      setIsMatchStarted(true);
      setError("");
    } catch (error) {
      setError("NETWORK ERROR! TRY AGAIN");
    }
  };

  const handleUpdateScore = async (increment) => {
    try {
      await updateScore(cid, increment, false)
      // setMessage(data.message);
      setMessage("Scored " + increment + " runs");
    } catch (error) {
      setMessage("Error updating score");
    }
  };

  const handleWicket = async () => {
    try {
      await updateScore(cid, 0, true)
      // setMessage(data.message);
      setMessage("Get Outta Here");
    } catch (error) {
      setMessage("Error updating wicket");
    }
  };

  const handleWide = async () => {
    try {
      await updateScore(cid, 1, false, true);
      setMessage("Wide ball, 1 run");
    } catch (error) {
      setMessage("Error updating wide ball");
    }
  };

  const handleUndoScore = async () => {
    try {
      await undoScore(cid);
      setMessage("Last action undone");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Nothing to undo");
      } else {
        setMessage("Error undoing last action");
      }
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
      await resetMatch(cid)
      setMessage("");
      setIsMatchStarted(false);
    } catch (error) {
      setMessage("Error reseting match");
    } 
    finally {
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="font-mono p-6 text-center text-2xl text-bold">
        Phoenix Cric App
      </div>

      {!isMatchStarted ? (
        <>
          <Button
          variant="contained"
          color="primary"
          onClick={handleStartMatch}
          fullWidth
          >
            Start Match
          </Button>
          {error && <center className="text-red-500 mt-6">{error}</center>}
        </>
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
                <CardContent sx={{ display: 'flex', flexDirection:'column', alignItems: 'center' }}>
                  <SportsCricketIcon sx={{ color: 'white', fontSize: { xs: '2rem', sm: '3rem' }, mr: 1 }} />
                  <Typography variant="h5" align="center" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Wicket
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4} sm={3}>
              <Card
                sx={{ height: 100, backgroundColor: "#f39c12", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleUndoScore}
              >
                <CardContent sx={{ display: 'flex', flexDirection:'column', alignItems: 'center' }}>
                  <UndoIcon sx={{ color: 'white', fontSize: { xs: '2rem', sm: '3rem' }, mr: 1 }} />
                  <Typography variant="h5" align="center" color="white" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Undo
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
