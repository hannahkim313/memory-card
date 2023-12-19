import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import getRandomIntInclusive from '../utilities/helpers';

const CardsDisplay = () => {
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

  const handleOnClick = () => {
    const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
    setCardsData(shuffled);
  };

  return (
    <section className="cards-container">
      <h2>Villager Cards</h2>
      {cardsData.length === 8 ? (
        cardsData.map((cardData) => (
          <Card
            key={cardData.id}
            src={cardData.card.image}
            villagerName={cardData.card.name}
            onClick={handleOnClick}
          />
        ))
      ) : (
        <p className="loading">Loading...</p>
      )}
    </section>
  );
};

export default CardsDisplay;
