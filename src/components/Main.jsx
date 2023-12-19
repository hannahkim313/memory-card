import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import getRandomIntInclusive from '../utilities/helpers';
import Scoreboard from './Scoreboard';

const Main = () => {
  const [cardsData, setCardsData] = useState([]);
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const url =
      'https://www.amiiboapi.com/api/amiibo/?gameseries=Animal&Crossing';

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal });
        const data = await response.json();
        const amiiboData = data.amiibo.filter(
          (amiibo) =>
            amiibo.release.na && amiibo.release.na.split('-')[0] === '2021'
        );
        const index = getRandomIntInclusive(0, amiiboData.length - 1, indices);
        const newIndices = [...indices, index];
        setIndices(newIndices);
        const cardData = {
          card: amiiboData[index],
          id: uuidv4(),
          hasClicked: false,
        };
        const newCardsData = [...cardsData, cardData];
        setCardsData(newCardsData);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetching data was aborted');
        } else {
          console.log(error);
        }
      }
    };

    if (cardsData.length < 8) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [cardsData, indices]);

  const handleOnClick = (e) => {
    const name = e.currentTarget.dataset.villagerName;
    const newCardsData = [...cardsData];
    const selectedCardData = newCardsData.find(
      (cardData) => cardData.card.name === name
    );
    selectedCardData.hasClicked = true;
    const shuffled = [...newCardsData].sort(() => Math.random() - 0.5);
    setCardsData(shuffled);
  };

  return (
    <main>
      {/* TODO: After a card has been clicked, increase the score if the card
    hasn't been clicked else update the best score and display a game over
    modal */}
      <Scoreboard />
      <h2 className="visible">Round 1/8</h2>
      <section className="cards-container">
        <h2>Villager Cards</h2>
        {cardsData.length === 8 ? (
          cardsData.map((cardData) => (
            <article key={cardData.id} className="card">
              <h3>Villager Card</h3>
              <button
                type="button"
                onClick={handleOnClick}
                data-villager-name={cardData.card.name}
              >
                <img src={cardData.card.image} alt="" />
                {cardData.card.name}
              </button>
            </article>
          ))
        ) : (
          <p className="loading">Loading...</p>
        )}
      </section>
    </main>
  );
};

export default Main;
