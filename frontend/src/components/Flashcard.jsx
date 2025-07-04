import { useState } from 'react';

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="w-full h-40 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-gray-700 rounded-lg flex items-center justify-center p-4 text-center cursor-pointer">
          <p className="text-white font-semibold">{card.front}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-blue-600 rounded-lg flex items-center justify-center p-4 text-center cursor-pointer transform rotate-y-180">
          <p className="text-white">{card.back}</p>
        </div>
      </div>
    </div>
  );
}
export default Flashcard;