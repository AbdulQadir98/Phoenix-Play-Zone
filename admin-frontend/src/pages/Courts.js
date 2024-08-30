import CardBox from "../components/CardBox";

const cardData = [
  { cid: 1, title: "Court 1 : Futsal (ISC01)", name: "This is the first Court" },
  { cid: 2, title: "Court 2 : Futsal (ISC02)", name: "This is the second Court" },
  { cid: 3, title: "Court 3 : Badminton Court", name: "This is the third Court" },
  { cid: 4, title: "Court 4 : Leather (ISC01)", name: "This is the fourth Court" },
  { cid: 5, title: "Court 5 : Leather (ISC02)", name: "This is the fifth Court" },
];

const Courts = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cardData.map((card, index) => (
        <CardBox key={card.cid} cid={card.cid} title={card.title} name={card.name} />
      ))}
    </div>
  );
};

export default Courts;
