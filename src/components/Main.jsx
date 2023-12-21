import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import getRandomIntInclusive from '../utilities/helpers';

const Main = () => {
  const [cardsData, setCardsData] = useState([]);
  const [indices, setIndices] = useState([]);
  const [currRound, setRound] = useState(1);
  const [currScore, setCurrScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [results, setResults] = useState({
    isGameOver: false,
    isWin: false,
  });

  const handleShuffle = (cards) => {
    setCardsData([...cards].sort(() => Math.random() - 0.5));
  };

  const handleIncreaseBestScore = () => {
    const newCurrScore = currScore + 1;

    if (newCurrScore > bestScore) {
      setBestScore(newCurrScore);
    }
  };

  const handleResults = (isGameOver, isWin) => {
    setResults({ ...results, isGameOver, isWin });
  };

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
        setIndices([...indices, index]);
        const cardData = {
          card: amiiboData[index],
          id: uuidv4(),
          hasClicked: false,
        };
        setCardsData([...cardsData, cardData]);
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
    if (currRound === 8 && currScore === 8) {
      setCurrScore(0);
      setBestScore(0);
      setRound(1);
      handleResults(false, false);
      setCardsData([]);
      setIndices([]);

      return;
    }

    const newCardsData = [...cardsData];
    const selectedCardData = newCardsData.find(
      (cardData) => cardData.card.name === e.currentTarget.dataset.villagerName
    );

    if (selectedCardData.hasClicked) {
      setCurrScore(0);
      setRound(1);
      handleResults(true, false);
      const resetCardsData = newCardsData.map((cardData) => ({
        ...cardData,
        hasClicked: false,
      }));
      handleShuffle(resetCardsData);
    } else {
      setCurrScore(currScore + 1);
      handleIncreaseBestScore();

      if (currRound === 8) {
        handleResults(true, true);
      } else {
        selectedCardData.hasClicked = true;
        setRound(currRound + 1);
        handleShuffle(newCardsData);
      }
    }
  };

  return (
    <main>
      <article className="game-data">
        <h2>Game Data</h2>
        <p className="round">Round {currRound}/8</p>
        <div className="scoreboard">
          <p>Current score: {currScore}</p>
          <p>Best score: {bestScore}</p>
        </div>
      </article>
      {results.isWin ? (
        <p
          className={
            results.isGameOver
              ? 'game-over-message visible'
              : 'game-over-message'
          }
        >
          You won! Refresh the page or click on any card to reset the game and
          play again with different cards.
        </p>
      ) : (
        <p
          className={
            results.isGameOver
              ? 'game-over-message visible'
              : 'game-over-message'
          }
        >
          You lost! Try again with the newly shuffled cards and beat your best
          score.
        </p>
      )}
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
