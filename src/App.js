import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [guessFeedback, setGuessFeedback] = useState('');

  // Map of language codes to their names
  const languageNames = {
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    tr: 'Turkish',
  };

  const languages = Object.keys(languageNames);

  const getRandomLanguage = () => {
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
  };

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleGuessChange = (event) => {
    setUserGuess(event.target.value);
  };

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslatedText('');
    setGuessFeedback('');
    setUserGuess('');

    const randomLanguage = getRandomLanguage();
    setLanguage(randomLanguage);

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`,
        {
          q: inputText,
          target: randomLanguage
        }
      );

      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
    } catch (err) {
      setError('Failed to translate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = () => {
    if (userGuess.toLowerCase() === languageNames[language].toLowerCase()) {
      setGuessFeedback({text: 'Correct! You are a language master!', color: 'green'});
    } else {
      setGuessFeedback({text: `Incorrect. The correct language was ${languageNames[language]} :(`, color: 'red'});
    }
  };

  const handleTryAgain = () => {
    setInputText('');
    setTranslatedText('');
    setGuessFeedback('');
    setUserGuess('');
    setError('');
    setLanguage('');
  };

  return (
    <div className="translation-app">
      <h1>Guess the Translation!</h1>
      {!translatedText ? (
        <>
          <textarea
            value={inputText}
            onChange={handleChange}
            placeholder="Enter text to translate"
          />
          <br />
          <button onClick={handleTranslate} disabled={loading}>
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </>
      ) : (
        <div className="result">
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
          <p>Guess the language:</p>
          <input
            type="text"
            value={userGuess}
            onChange={handleGuessChange}
            placeholder="Enter your guess"
          />
          
          {!guessFeedback && (
        <button onClick={handleGuess}>Submit Guess</button>
        )}

          {guessFeedback && (
  <p className="feedback" style={{ color: guessFeedback.color }}>
    {guessFeedback.text}
  </p>
)}
        </div>
      )}
      {guessFeedback && (
        <button onClick={handleTryAgain}>Restart</button>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
