const Score = () => {
  return (
    <div className="h-[40vh] m-0 bg-[#2c3e50] text-[#ecf0f1] flex justify-evenly items-center">
      <div className="flex flex-col items-center mx-8">
        <div className="font-bold text-[12rem] leading-none">135/4</div>
      </div>
      <div className="flex flex-col items-center mx-8">
        <div className="text-6xl font-light uppercase">Overs</div>
        <div className="font-bold text-[8rem] leading-none">1.5</div>
      </div>
    </div>
  );
};

export default Score;
