import{ useState, useEffect } from "react";
const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress,setprogress] = useState(20);

  useEffect(() => {
    fetch('https://api.jsonserve.com/Uw5CrX')
    .then((res)=>res.json())
    .then((data) =>{
      console.log(data);
    }) 
    .catch((err) => {console.log(err)});
}
,[]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-5">
      <progress className="rounded-lg" value={progress}></progress>
      {loading ? (
        <p>Loading questions...</p>
      ) : !quizFinished ? (
        questions.length > 0 ? (
          <div className="max-w-lg bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
            <div className="grid gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.isCorrect)}
                  className="p-3 bg-blue-500 rounded hover:bg-blue-700 transition"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>No questions available.</p>
        )
      ) : (
        <div className="max-w-lg bg-green-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Quiz Completed!</h2>
          <p className="text-lg mt-2">Your Score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
