const Score = ({ scores, cid }) => {
  const overs = Math.floor(scores[cid].balls / 6);
  const ballsInOver = scores[cid].balls % 6;

  return (
    <div className="h-[40vh] m-0 flex justify-evenly items-center" style={{ backgroundColor: "#2c3e50", color: "#ecf0f1" }}>
      <div className="flex flex-col items-center mx-8">
        <div className="font-bold text-[12rem] leading-none">
          {scores[cid].runs}/{scores[cid].wickets}
        </div>
      </div>
      <div className="flex flex-col items-center mx-8">
        <div className="text-6xl font-light uppercase">Overs</div>
        <div className="font-bold text-[8rem] leading-none">
          {overs}.{ballsInOver}
        </div>
      </div>
    </div>
  );
};

export default Score;
