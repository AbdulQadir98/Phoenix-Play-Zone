import { useState } from "react";
import { resetMatch, startMatch, updateScore, undoScore } from "../services";

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
      await updateScore(cid, increment, false);
      setMessage("Scored " + increment + " runs");
    } catch (error) {
      setMessage("Error updating score");
    }
  };

  const handleWicket = async () => {
    try {
      await updateScore(cid, 0, true);
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
      await resetMatch(cid);
      setMessage("");
      setIsMatchStarted(false);
    } catch (error) {
      setMessage("Error resetting match");
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div className="container">
      <div className="title">Phoenix Cric App</div>

      {!isMatchStarted ? (
        <>
          <button className="start-btn" onClick={handleStartMatch}>
            Start Match
          </button>
          {error && <center className="error-msg">{error}</center>}
        </>
      ) : (
        <div className="score-section">
          <div className="button-grid">
            {[1, 2, 3, 4, 6].map((increment) => (
              <button
                key={increment}
                className="score-btn"
                onClick={() => handleUpdateScore(increment)}
              >
                {increment}
              </button>
            ))}

            <button className="wide-btn" onClick={handleWide}>
              Wide
            </button>
            <button className="wicket-btn" onClick={handleWicket}>
              Wicket
            </button>
            <button className="undo-btn" onClick={handleUndoScore}>
              Undo
            </button>
          </div>

          {message && <div className="message-box">{message}</div>}

          <button className="reset-btn" onClick={handleOpenDialog}>
            Reset Match
          </button>

          {openDialog && (
            <div className="dialog">
              <div className="dialog-content">
                <p>Are you sure you want to reset the match?</p>
                <div className="dialog-actions">
                  <button className="cancel-btn" onClick={handleCloseDialog}>
                    Cancel
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={handleConfirmResetMatch}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
