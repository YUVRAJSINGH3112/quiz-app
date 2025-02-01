import { useState, useEffect } from "react";

const QuizApp = () => {
  const [data, setData] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 min timer

  // Fetch quiz data
  useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !quizFinished) {
      setQuizFinished(true); // Finish quiz when timer hits 0
    }
  }, [quizStarted, timeLeft, quizFinished]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Handle answer selection
  const handleAnswer = (option, index) => {
    if (!quizFinished) {
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestion]: index,
      }));

      if (option.is_correct) {
        setScore((prev) => prev + 4);
      } else {
        setScore((prev) => prev - 1);
      }
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <>
      {!quizStarted ? (
        <div className="startbox text-center">
          <h1 className="text-5xl font-medium">Welcome to the Quiz</h1>
          <div className="info">
            <h2>Title: {data.title}</h2>
            <h2>Topic: {data.topic}</h2>
            <p>This quiz has {questions.length} questions.</p>
            <p>Each correct answer earns you 4 points, while each wrong answer subtracts 1 point.</p>
            <p>Good luck!</p>
          </div>
          <button
            className="btn bg-[#2094f3] text-white px-4 py-2 rounded-2xl mt-4"
            onClick={() => setQuizStarted(true)}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black p-5">
          {/* Timer */}
          {!quizFinished && (
            <div className="fixed top-4 right-4 text-black px-4 py-2 rounded ">
              ⏳ Time Left: {formatTime(timeLeft)}
            </div>
          )}

          {loading ? (
            <p>Loading questions...</p>
          ) : !quizFinished ? (
            questions.length > 0 ? (
              <div className="question-container">
                <p className="text-gray-700 text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <progress value={currentQuestion + 1} max={questions.length} className="progress-bar" />
                <h2 className="question">{questions[currentQuestion].description}</h2>
                <div className="grid gap-3 mt-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option, index)}
                      className={`option transition ${
                        selectedOptions[currentQuestion] !== undefined
                          ? index === selectedOptions[currentQuestion]
                            ? option.is_correct
                              ? "bg-green-500 text-white" // Correct selected
                              : "bg-red-500 text-white" // Wrong selected
                            : "bg-gray-300 text-black" // Unselected options become gray
                          : "bg-blue-500 hover:bg-blue-700 text-white"
                      }`}
                      disabled={selectedOptions[currentQuestion] !== undefined}
                    >
                      {option.description}
                    </button>
                  ))}
                </div>

                {/* View Solution Button */}
                {selectedOptions[currentQuestion] !== undefined && (
                  <button
                    className="mt-3 text-blue-500 cursor-pointer"
                    onClick={() => setShowSolution(true)}
                  >
                    View Detailed Solution
                  </button>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between h-20 items-center">
                  <button
                    className="next-button"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Prev
                  </button>
                  <button
                    className="next-button"
                    onClick={nextQuestion}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p>No questions available.</p>
            )
          ) : (
            <div className="score max-w-lg bg-blue-500 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <p className="text-lg mt-2">Your Score: {score} / {questions.length * 4}</p>
            </div>
          )}

          {/* Solution Modal */}
          {showSolution && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded shadow-md w-96 relative">
                <button
                  className="absolute top-2 right-2 text-black text-xl"
                  onClick={() => setShowSolution(false)}
                >
                  ✖
                </button>
                <h3 className="text-lg font-bold mb-3">Detailed Solution</h3>
                <p className="text-gray-700">{questions[currentQuestion].solution}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuizApp;
