import { useState, useEffect } from "react";

const QuizApp = () => {
  const [data,setData]=useState([]);
  //boolean to check whether quiz started or not
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
  const handleAnswer = (isCorrect) => {
        if (isCorrect) setScore(score+4);
        else setScore(score-1);
    
    const nextQuestion = currentQuestion + 1; // Move to next question
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion); // Update question index
    } else {
      setQuizFinished(true); // If no more questions, mark quiz as finished
    }
  };

  return (
    <>
      {quizStarted? (
        <div className="startbox">
        <h1 className="text-5xl font-medium">Welcome to the Quiz</h1>
        <div className="info">
          <h2>Title:{data.title}</h2>
          <h2>Topic:{data.topic}</h2>
          <h2></h2>
          <p>This quiz has {questions.length} questions.</p>
          <p>Each correct answer earns you 4 points, while each wrong answer subtracts 1 point.</p>
          <p>Good luck!</p>
        </div>
        <button className="btn text-center bg-[#2094f3] rounded-2xl " onClick={() => setQuizStarted(true)}>Start Quiz</button>
        </div>
      ):(
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-white p-5">
        {/* Show loading message while fetching data */}
        {loading ? (
          <p>Loading questions...</p>
        ) : !quizFinished ? (
          // Display quiz questions if available
          questions.length > 0 ? (
          // Display current question and options

          <div className="question-container">
             <p className="text-black">Question {currentQuestion + 1} of {questions.length}</p>
             <progress value={currentQuestion+1} className="progress-bar"  max="10"></progress>
             <h2 className="question">{questions[currentQuestion].description}</h2>
             <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                   <button
                      key={index}
                      onClick={() => handleAnswer(option.is_correct)}
                      className="option bg-blue-500 rounded hover:bg-blue-700 transition"
                   >
                      {option.description}
                   </button>
                ))}
             </div>
          </div>

          ) : (
            <p>No questions available.</p>
          )
        ) : (
          // Display score after quiz completion
          <div className="max-w-lg bg-green-700 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            <p className="text-lg mt-2">Your Score: {score} / {questions.length * 4}</p>
          </div>
        )}
      </div>
      )}
      </>
  );
};

export default QuizApp;
