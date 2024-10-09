import { useEffect, useState } from "react";
import { PROD_API_URL } from "../constants";
import Score from "../components/Score";

const Cricket = () => {
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [scores, setScores] = useState({
    1: { runs: 0, wickets: 0, balls: 0 },
    2: { runs: 0, wickets: 0, balls: 0 },
  });

  let port;
  try {
    port = window.location.port;
  } catch (error) {
    console.error("An error occurred while retrieving the port:", error);
  }

  const cid = port === "3001" ? 1 : 2;

  // to flag match start and set scores
  useEffect(() => {
    const eventSource = new EventSource(`${PROD_API_URL}/events/score`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("HERE ",data)
        if (
          (parseInt(data.cid) === 1 && port === "3001") ||
          (parseInt(data.cid) === 2 && port === "3002")
        ) {
          setIsMatchStarted(data.isMatchStarted);
          // setScores(data.scores);
          if (data.scores && data.scores[cid]) {
            setScores((prevScores) => ({
              ...prevScores,
              [cid]: data.scores[cid], // Safely update the score for the current cid
            }));
          } else {
            console.log(`Scores for TV ${cid} are not set.`);
          }
        }
      } catch (error) {
        console.error("Error parsing SSE data when flagging or setting score: ", error);
      }
    };

    // Clean up the event source on component unmount
    return () => {
      eventSource.close();
    };
  }, []); // Run only once on component mount

  return (
    <div>
        {isMatchStarted && <Score scores={scores} cid={cid} />}
    </div>
  );
};

export default Cricket;
