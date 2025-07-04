import { useState } from 'react';

function Quiz({ questions = [] }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const renderResult = (question, index) => {
    if (!showResults) return null;
    const isCorrect = selectedAnswers[index] === question.correctAnswer;
    return <p className={`mt-2 text-sm font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isCorrect ? 'Correct!' : `Correct Answer: ${question.correctAnswer}`}</p>;
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="font-semibold text-white mb-3">{index + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, i) => (
              <button key={i} onClick={() => setSelectedAnswers({...selectedAnswers, [index]: option})} disabled={showResults} className={`w-full text-left p-3 rounded-md transition-colors text-sm ${selectedAnswers[index] === option ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} ${showResults ? 'cursor-not-allowed' : ''}`}>
                {option}
              </button>
            ))}
            {renderResult(q, index)}
          </div>
        </div>
      ))}
      <div className="text-center mt-6">
        <button onClick={() => setShowResults(true)} disabled={showResults} className="bg-green-600 text-white font-bold px-6 py-2 rounded-md shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
          Check Answers
        </button>
      </div>
    </div>
  );
}
export default Quiz;