const Card = ({ keyValue, src, villagerName, onClick }) => (
  <article key={keyValue} className="card">
    <h3>Villager Card</h3>
    <button type="button" onClick={onClick}>
      <img src={src} alt="" />
      {villagerName}
    </button>
  </article>
);

export default Card;
