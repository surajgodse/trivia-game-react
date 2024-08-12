import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api_category.php"
      );
      setCategories(response.data.trivia_categories);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`
      );
      setQuestions(response.data.results);
      setIsStarted(true);
    } catch (error) {
      toast.error("Failed to fetch questions.");
    }
  };

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleStartOver = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setIsStarted(false);
    setSelectedCategory("");
    setSelectedDifficulty("");
  };

  return (
    <>
      <div className="app-container">
        <ToastContainer autoClose={5000} />
        {isStarted ? (
          <>
            {showScore ? (
              <div className="score-section">
                You scored {score} out of {questions.length}
              </div>
            ) : (
              <>
                {questions.length > 0 && (
                  <div className="question-section">
                    <div className="question-count">
                      <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
                    </div>
                    <div className="question-text">
                      {questions[currentQuestionIndex].question}
                    </div>
                  </div>
                )}
                <div className="answer-section">
                  {questions.length > 0 && (
                    <>
                      {questions[currentQuestionIndex].incorrect_answers.map((answerOption, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerOptionClick(false)}
                        >
                          {answerOption}
                        </button>
                      ))}
                      <button
                        onClick={() => handleAnswerOptionClick(true)}
                      >
                        {questions[currentQuestionIndex].correct_answer}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            <button className="start-over-btn" onClick={handleStartOver}>Start Over</button>
          </>
        ) : (
          <div className="start-section">
            <h1>Trivia Game</h1>
            <div className="selection-container">
              <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select onChange={(e) => setSelectedDifficulty(e.target.value)} value={selectedDifficulty}>
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button onClick={fetchQuestions}>Start Game</button>
            </div>
          </div>
        )}
      </div>
      <footer>
        <p>Created by @Suraj Godse</p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/suraj-godse" target="_blank" rel="noopener noreferrer">
            <img src="images/linkedin-logo.png" alt="LinkedIn" />
          </a>
          <a href="https://github.com/surajgodse" target="_blank" rel="noopener noreferrer">
            <img src="images/github-logo.png" alt="GitHub" />
          </a>
        </div>
      </footer>
    </>
  );
}
