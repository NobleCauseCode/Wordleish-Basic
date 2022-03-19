import { getValue } from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Guess } from './Models/Guess';
import { GuessDetail } from './Models/GuessDetail';

function App() {
  const [wordList, setWordList] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [guesses, setGuesses] = useState([] as Guess[]);

  useEffect(() => {
    const init = async () => {
      if (wordList.length === 0) {
        const response = await axios.get('http://localhost:3000/data/words.txt');
        const words = response.data;
        const converted = words.split('\r\n').map((word: string) => word.toLowerCase());
        const randomIndex = Math.floor(Math.random() * converted.length);
        setSelectedWord(converted[randomIndex]);
        setWordList(converted);
      }
    };
    init();
  }, [wordList]);

  const updateGuess = (value: string, x: number, y: number) => {
    const updatedGuesses = [...guesses];
    if (guesses.length === 0) {
      updatedGuesses.push({
        row: x,
        items: [
          {
            position: y,
            value,
          } as GuessDetail,
        ],
      } as Guess);
    } else {
      updatedGuesses[x].items[y] = {
        position: y,
        value,
      } as GuessDetail;
    }
    setGuesses(updatedGuesses);
  };

  const getValue = (x: number, y: number) => {
    if (guesses.length === 0 || guesses.length < x) {
      return '';
    }
    if (guesses[x].items.length - 1 < y) {
      return '';
    }
    console.log(guesses);
    return guesses[x].items[y].value;
  };

  const gradeIt = () => {
    const guessesCopy = [...guesses];
    const currentGuess = guessesCopy[guessesCopy.length - 1];
    const currentRow = currentGuess.row;

    for (let i = 0; i < selectedWord.length; i++) {
      if (getValue(currentRow, i) === selectedWord[i]) {
        console.log('CORRECT!');
        currentGuess.items[i].isCorrect = true;
        currentGuess.items[i].css = 'bg-correct-answer';
      }

      if (selectedWord.includes(getValue(currentRow, i)) && !currentGuess.items[i].isCorrect) {
        console.log('wrong place!');
        currentGuess.items[i].notInPlace = true;
        currentGuess.items[i].css = 'bg-wrong-place';
      }

      if (!selectedWord.includes(getValue(currentRow, i)) && !currentGuess.items[i].isCorrect) {
        console.log('Not in word!');
        currentGuess.items[i].notInAnswer = true;
        currentGuess.items[i].css = 'bg-wrong-answer';
      }

      if (currentGuess.items.filter((x) => x.isCorrect).length === selectedWord.length) {
        console.log('You win!');
        currentGuess.isWinner = true;
      }
    }
    setGuesses(guessesCopy);
  };
  return (
    <div className='container mx-auto px-2 py-4'>
      <h1 className='text-center font-medium leading-tight text-4xl text-black-600 mt-0 mb-2'>WORDLEISH</h1>
      <div className='text-center'>{selectedWord}</div>

      <div className='flex items-center justify-center flex-col'>
        <div className='grid grid-cols-5 gap-4'>
          <input
            name='guess-0-0'
            id='guess-0-0'
            className={`border-2 border-grey-500 py-2 px-3 w-16 text-2xl text-center text-grey-darkest w-16 ${guesses[0]?.items[0]?.css}`}
            type='text'
            maxLength={1}
            onChange={(e) => updateGuess(e.target.value, 0, 0)}
            value={getValue(0, 0)}
          />
          <input
            name='guess-0-0'
            id='guess-0-0'
            className={`border-2 border-grey-500 py-2 px-3 w-16 text-2xl text-center text-grey-darkest w-16 ${guesses[0]?.items[1]?.css}`}
            type='text'
            maxLength={1}
            onChange={(e) => updateGuess(e.target.value, 0, 1)}
            value={getValue(0, 1)}
          />
          <input
            name='guess-0-0'
            id='guess-0-0'
            className={`border-2 border-grey-500 py-2 px-3 w-16 text-2xl text-center text-grey-darkest w-16 ${guesses[0]?.items[2]?.css}`}
            type='text'
            maxLength={1}
            onChange={(e) => updateGuess(e.target.value, 0, 2)}
            value={getValue(0, 2)}
          />
          <input
            name='guess-0-0'
            id='guess-0-0'
            className={`border-2 border-grey-500 py-2 px-3 w-16 text-2xl text-center text-grey-darkest w-16 ${guesses[0]?.items[3]?.css}`}
            type='text'
            maxLength={1}
            onChange={(e) => updateGuess(e.target.value, 0, 3)}
            value={getValue(0, 3)}
          />
          <input
            name='guess-0-0'
            id='guess-0-0'
            className={`border-2 border-grey-500 py-2 px-3 w-16 text-2xl text-center text-grey-darkest w-16 ${guesses[0]?.items[4]?.css}`}
            type='text'
            maxLength={1}
            onChange={(e) => updateGuess(e.target.value, 0, 4)}
            value={getValue(0, 4)}
          />
        </div>
        <button
          className='mt-2 ml-2 border-1 border-white bg-white text-wordleishdark font-med font-semibold rounded h-10 w-28 hover:bg-light-grey'
          onClick={gradeIt}
        >
          Guess
        </button>
      </div>
    </div>
  );
}

export default App;
