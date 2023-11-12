// css
import './App.css';

// data 
import {wordsList} from "./data/words";

// hooks
import { useCallback, useEffect, useState } from 'react';

// components
import Game from './components/Game';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';


const stages = [
  {id:1, name:"start"},
  {id:2, name:"game"},
  {id:3, name:"end"},
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPicketWord] = useState("");
  const [pickedCategory, setPicketCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category 
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]


    // pick a random word 
    const word = 
      words[category][Math.floor(Math.random()  * words[category].length)];


    return {word, category};
  }, [words])

  // Start game
  const startGame = useCallback(() => {

    // clear all letters
    clearLetterStates();
    
    const {word, category} = pickWordAndCategory();

    // create array of letter 
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())


    // fill states 
    setPicketWord(word);
    setPicketCategory(category);
    setLetters(wordLetters);
    
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Process the letter
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter) ){
      return;
    };

    // push guessed letter or remove a change 
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    }else{
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }

    
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0){

      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name);
    }
  }, [guesses])

  // check win condicion 
  useEffect(() => {
  
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === "game"){
      // add score
      setScore((actualScore) => actualScore += 100);

      // restart game
      startGame();
    }
  
  }, [guessedLetters, letters, startGame])

  // Restart
  const retry = () => {

    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && 
      <Game 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />}
        {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
};

export default App
