import { useState, useEffect } from "react";

const QuizApp = () => {
  const [data, setData] = useState([]);
  // Boolean to check whether quiz started or not
  const [quizStarted, setQuizStarted] = useState(false);
  // State to store quiz questions
  const [questions, setQuestions] = useState([]);
  // State to track current question index
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // State to keep track of user's score
  const [score, setScore] = useState(0);
  // State to check if the quiz is finished
  const [quizFinished, setQuizFinished] = useState(false);
  // State to manage loading state while fetching data
  const [loading, setLoading] = useState(true);
  // State to store the index of the selected option
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showSolution,setShowSolution]= useState(false);

  // Fetch quiz data from local server when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/data") // Fetching data from backend
      .then((res) => res.json()) // Convert response to JSON
      .then((data) => {
        setData(data); // Store fetched data in state
        setQuestions(data.questions); // Store fetched questions in state
        console.log(data); // Debugging log to verify fetched data
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((err) => console.log(err)); // Handle fetch errors
  }, []);

  // Function to handle answer selection
  const handleAnswer = (option, index) => {
    // Set the index of the selected option immediately
    setSelectedOptionIndex(index);
    setShowSolution(true);
    
    // Update the score based on correctness
    if (option.is_correct) {
      setScore((prevScore) => prevScore + 4);
    } else {
      setScore((prevScore) => prevScore - 1);
    }
  };

  const next=()=>{
    setSelectedOptionIndex(null);
    setShowSolution(false);
    const nextQuestion = currentQuestion + 1; // Move to next question
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion); // Update question index
    } else {
      setQuizFinished(true); // If no more questions, mark quiz as finished
    }
  }
  const prev=()=>{
    setShowSolution(false);
    const nextQuestion = currentQuestion - 1; // Move to next question
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion); // Update question index
    } else {
      setQuizFinished(true); // If no more questions, mark quiz as finished
    }
  }
  

  return (
    <>
      {!quizStarted ? (
        <div className="startbox">
          <h1 className="text-5xl font-medium">Welcome to the Quiz</h1>
          <div className="info">
            <h2>Title: {data.title}</h2>
            <h2>Topic: {data.topic}</h2>
            <p>This quiz has {questions.length} questions.</p>
            <p>Each correct answer earns you 4 points, while each wrong answer subtracts 1 point.</p>
            <p>Good luck!</p>
          </div>
          <button
            className="btn text-center bg-[#2094f3] rounded-2xl"
            onClick={() => setQuizStarted(true)}
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white p-5">
          {/* Show loading message while fetching data */}
          {loading ? (
            <p className="text-black">Loading questions...</p>
          ) : !quizFinished ? (
            questions.length > 0 ? (
              <div className="question-container">
                <p className="text-black">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <progress
                  value={currentQuestion + 1}
                  className="progress-bar"
                  max="10"
                ></progress>
                <h2 className="question text-black">
                  {questions[currentQuestion].description}
                </h2>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option, index)}
                      className={`option rounded transition duration-150 text-white ${
                        selectedOptionIndex !== null
                          ? index === selectedOptionIndex
                            ? option.is_correct
                              ? "bg-green-500" // Correct answer: green
                              : "bg-red-500" // Wrong answer: red
                            : "bg-gray-500" // Other options become grey
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                      disabled={selectedOptionIndex !== null} // Disable buttons after selection
                    >
                      {option.description}
                    </button>
                  ))}
                </div>
                {showSolution? (
                  <button
                    className="mt-4 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg"
                    onClick={() => setShowSolution(true)}
                  >
                    View Detailed Solution
                  </button>
                ):""}
                 <div className="flex justify-between h-24 items-center">
                 <button
                  className="next-button"
                  onClick={prev}
                >Prev</button>
                <button
                  className="next-button"
                  onClick={next}
                >Next</button>
                 </div>
              </div>
            ) : (
              <p>No questions available.</p>
            )
          ) : (
            <div className="max-w-lg bg-green-700 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <p className="text-lg mt-2">
                Your Score: {score} / {questions.length * 4}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuizApp;
