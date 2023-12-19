const Card = ({ keyValue, src, villagerName }) => (
  <article key={keyValue} className="card">
    <h3>Villager Card</h3>
    <button type="button">
      <img src={src} alt="" />
      {villagerName}
    </button>
  </article>
);

export default Card;
