import CardsDisplay from './CardsDisplay';
import Scoreboard from './Scoreboard';

const Main = () => (
  <main>
    <Scoreboard />
    <h2 className="visible">Round 1/8</h2>
    <CardsDisplay />
  </main>
);

export default Main;
