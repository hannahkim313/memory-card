const Card = () => (
  <article className="card">
    <h3>Villager Card</h3>
    <button type="button">
      <img
        // TODO: Change src link after implementing a way to fetch and use the data retrieved
        // from the API call. This is an example link used as a filler to get the styling right.
        src="https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_03090001-00c60502.png"
        alt=""
      />
      Villager name
    </button>
  </article>
);

export default Card;
