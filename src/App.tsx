import Question from "./components/Question";
import { IQuestion, useQuestions } from "./hooks/useQuestions";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const { loadQuestions } = useQuestions();

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);

  const questions = useRef<IQuestion[]>([]);

  useEffect(() => {
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const loadData = async () => {
      let q = await loadQuestions("./data/segeln.json");

      q = q.map((question) => {
        question.answers = shuffle(question.answers);
        return question;
      });

      questions.current = q;

      setCurrentIndex(0);
    };

    loadData();
  }, []);

  const handleChangeQuestion = (toNext: boolean) => {
    setCurrentIndex((prevIndex) => {
      const index = toNext ? prevIndex + 1 : prevIndex - 1;

      if (index < 0 || index >= questions.current.length) {
        return prevIndex;
      } else {
        return index;
      }
    });
  };

  const currentQuestion = questions.current[currentIndex];

  return (
    <div className="m-10 rounded-sm border bg-gray-50 p-5 shadow-sm">
      <div className="mb-10">
        {currentQuestion && (
          <Question question={currentQuestion} revealCorrect={revealCorrect} />
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => {
            handleChangeQuestion(false);
          }}
          className="rounded-sm bg-blue-600 px-5 py-2 text-blue-100"
        >
          Previous
        </button>

        <div>
          {currentIndex + 1} / {questions.current.length}
        </div>

        <button
          onClick={() => {
            handleChangeQuestion(true);
          }}
          className="rounded-sm bg-blue-600 px-5 py-2 text-blue-100"
        >
          Next
        </button>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setRevealCorrect((rev) => !rev)}
          className="text-sm"
        >
          Reveal correct
        </button>
      </div>
    </div>
  );
}
