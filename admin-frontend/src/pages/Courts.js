import CardBox from "../components/CardBox";
import court1 from "../assets/futsal-court.webp";

const cardData = [
  { cid: 1, title: "Court 1 : Futsal Court", name: "Entrance Futsal Court", image: court1 },
  { cid: 2, title: "Court 2 : Futsal Court", name: "Inner Futsal Court", image: court1 },
  { cid: 3, title: "Court 3 : Badminton Court", name: "Indoor Badminton Court", image: court1 },
  { cid: 4, title: "Court 4 : Leather Court", name: "Machine Leather Ball Court", image: court1 },
  { cid: 5, title: "Court 5 : Leather Court", name: "Normal Leather Court", image: court1},
];

const Courts = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cardData.map((card, index) => (
        <CardBox key={card.cid} cid={card.cid} title={card.title} name={card.name} image={card.image}/>
      ))}
    </div>
  );
};

export default Courts;
