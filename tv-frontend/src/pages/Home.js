import { useState } from "react";
import TimerDisplay from "../components/TimerDisplay";
import Score from "../components/Score";

const Home = () => {

  const [hasScore, setHasScore] = useState(false);

  return (
    <div>
      <TimerDisplay hasScore={hasScore}/>
      {hasScore && <Score />}
    </div>
  );
};

export default Home;
