
import React, { useState, useMemo } from 'react';
import { VOCAB_LIST } from '../constants';
import { QuizState, CEFRLevel, VocabWord } from '../types';

const VocabGame: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL' | null>(null);
  const [state, setState] = useState<QuizState>({
    currentWordIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    showFeedback: false,
    selectedOption: null,
    isCorrect: null,
    quizCompleted: false,
    wrongAnswers: []
  });

  const filteredWords = useMemo(() => {
    let list = selectedLevel === 'ALL' || !selectedLevel 
      ? VOCAB_LIST 
      : VOCAB_LIST.filter(w => w.level === selectedLevel);
    
    // Shuffle words for each session and take a slice (e.g., 20 words)
    return [...list].sort(() => Math.random() - 0.5).slice(0, 20);
  }, [selectedLevel]);

  const currentWord = filteredWords[state.currentWordIndex];

  // Randomize exactly 4 options for each word (1 correct + 3 wrong)
  const currentOptions = useMemo(() => {
    if (!currentWord) return [];
    
    // Take the correct meaning
    const correct = currentWord.correctMeaning;
    
    // Take exactly 3 wrong options (in case the dataset has more or fewer)
    const wrong = [...currentWord.wrongOptions].slice(0, 3);
    
    // Combine and shuffle
    return [correct, ...wrong].sort(() => Math.random() - 0.5);
  }, [currentWord]);

  const handleOptionClick = (option: string) => {
    if (state.showFeedback) return;

    const isCorrect = option === currentWord.correctMeaning;
    const newStreak = isCorrect ? state.streak + 1 : 0;

    setState(prev => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: newStreak,
      maxStreak: Math.max(prev.maxStreak, newStreak),
      wrongAnswers: !isCorrect ? [...prev.wrongAnswers, currentWord] : prev.wrongAnswers
    }));
  };

  const handleNext = () => {
    if (state.currentWordIndex < filteredWords.length - 1) {
      setState(prev => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1,
        showFeedback: false,
        selectedOption: null,
        isCorrect: null
      }));
    } else {
      setState(prev => ({ ...prev, quizCompleted: true }));
    }
  };

  const resetQuiz = () => {
    setSelectedLevel(null);
    setState({
      currentWordIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      showFeedback: false,
      selectedOption: null,
      isCorrect: null,
      quizCompleted: false,
      wrongAnswers: []
    });
  };

  if (!selectedLevel) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3">
             <span className="text-white text-4xl font-black italic">V</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pick Your Challenge</h2>
          <p className="text-gray-500 mt-2">Daily academic drill to boost your score.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'B1', title: 'Intermediate', color: 'green', desc: 'Essential academic vocabulary' },
            { id: 'B2', title: 'Upper-Intermediate', color: 'blue', desc: 'University standard lexicon' },
            { id: 'C1', title: 'Advanced', color: 'purple', desc: 'Sophisticated band 8-9 words' },
            { id: 'ALL', title: 'Grand Slam', color: 'indigo', desc: 'Mixed difficulty marathon' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id as any)}
              className="p-5 text-left border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group active:scale-[0.98]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600">{lvl.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{lvl.desc}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-${lvl.color}-100 flex items-center justify-center text-${lvl.color}-600 font-bold`}>
                  {lvl.id === 'ALL' ? '🔥' : lvl.id}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (state.quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
          
          <div className="mb-8">
            <span className="text-5xl mb-4 block">🎯</span>
            <h2 className="text-4xl font-black text-gray-900">Session Review</h2>
            <div className="flex justify-center gap-4 mt-6">
               <div className="bg-gray-50 px-6 py-3 rounded-2xl">
                 <span className="block text-xs font-bold text-gray-400 uppercase">Score</span>
                 <span className="text-2xl font-black text-indigo-600">{state.score}/{filteredWords.length}</span>
               </div>
               <div className="bg-gray-50 px-6 py-3 rounded-2xl">
                 <span className="block text-xs font-bold text-gray-400 uppercase">Max Streak</span>
                 <span className="text-2xl font-black text-orange-500">{state.maxStreak} 🔥</span>
               </div>
            </div>
          </div>

          {state.wrongAnswers.length > 0 ? (
            <div className="text-left space-y-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="mr-2">📝</span> Words to Revisit
              </h3>
              <div className="space-y-4">
                {state.wrongAnswers.map((w, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="font-black text-indigo-600 text-lg">{w.word}</span>
                       <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">{w.level}</span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium mb-2 italic">"{w.definition}"</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="font-bold text-gray-500 uppercase">Example:</span> {w.exampleSentence}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-indigo-50 rounded-3xl border-2 border-dashed border-indigo-200">
              <span className="text-6xl block mb-4">🎉</span>
              <h3 className="text-2xl font-black text-indigo-700">Flawless Victory!</h3>
              <p className="text-indigo-600/70">You mastered every word in this session.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-12">
            <button
              onClick={() => setSelectedLevel(null)}
              className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all active:scale-95"
            >
              Choose Level
            </button>
            <button
              onClick={resetQuiz}
              className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 safe-top pb-12">
      <div className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-gray-100 px-4 py-3 shadow-sm flex items-center gap-4">
         <button onClick={resetQuiz} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]" 
              style={{ width: `${((state.currentWordIndex + 1) / filteredWords.length) * 100}%` }}
            />
         </div>
         <div className="flex items-center gap-2">
            {state.streak > 0 && (
              <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-sm font-black animate-bounce">
                {state.streak}🔥
              </span>
            )}
            <span className="text-sm font-black text-gray-900 tabular-nums">
              {state.currentWordIndex + 1}/{filteredWords.length}
            </span>
         </div>
      </div>

      <div className="mt-20">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl transition-all duration-300">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-2">
             <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                TOEFL / IELTS {currentWord.level}
             </span>
             <h3 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">
               {currentWord.word}
             </h3>
             <p className="text-gray-400 font-medium">Choose the best definition</p>
          </div>

          <div className="space-y-3">
            {currentOptions.map((option, idx) => (
              <button
                key={idx}
                disabled={state.showFeedback}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group active:scale-[0.98] flex items-center gap-4 ${
                  state.showFeedback
                    ? option === currentWord.correctMeaning
                      ? 'border-green-500 bg-green-50 text-green-900 shadow-md scale-[1.02]'
                      : option === state.selectedOption
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-transparent opacity-20'
                    : 'border-gray-50 bg-gray-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                  state.showFeedback && option === currentWord.correctMeaning 
                    ? 'bg-green-200 text-green-700' 
                    : 'bg-white text-gray-400 shadow-sm'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-bold text-lg leading-tight flex-1">{option}</span>
                {state.showFeedback && option === currentWord.correctMeaning && (
                   <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                )}
              </button>
            ))}
          </div>

          {state.showFeedback && (
            <div className={`mt-10 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${state.isCorrect ? 'bg-green-600 shadow-xl shadow-green-100' : 'bg-red-600 shadow-xl shadow-red-100'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  {state.isCorrect ? '🎉' : '📖'}
                </div>
                <div className="text-white">
                  <h4 className="font-black text-2xl tracking-tight">
                    {state.isCorrect ? 'Congratulations!' : 'Study Moment'}
                  </h4>
                  <p className="text-white/80 font-medium">
                    {state.isCorrect ? 'Perfect accuracy!' : 'Learn this word for next time'}
                  </p>
                </div>
              </div>

              {!state.isCorrect && (
                 <div className="bg-black/10 backdrop-blur-md rounded-2xl p-6 mb-6 text-white border border-white/10">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Meaning</span>
                    <p className="text-xl font-bold leading-snug mb-4">"{currentWord.correctMeaning}"</p>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Example</span>
                    <p className="text-sm font-medium italic text-white/90 leading-relaxed">"{currentWord.exampleSentence}"</p>
                 </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-white text-gray-900 font-black py-5 rounded-2xl hover:bg-gray-50 transition-all shadow-lg active:scale-95 text-lg"
              >
                {state.currentWordIndex === filteredWords.length - 1 ? 'Finish & Review' : 'Next Word'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabGame;
