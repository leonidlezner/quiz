import Question from "./components/Question";
import { IQuestion, useQuestions } from "./hooks/useQuestions";
import { useEffect, useRef, useState } from "react";
import useStorageState from "./hooks/useStorageState";

export default function App() {
  const { loadQuestions } = useQuestions();

  const [currentIndex, setCurrentIndex] = useStorageState<number>(
    -1,
    "currentIndex"
  );
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useStorageState<{
    [key: number]: number;
  }>({}, "userAnswers");

  const [questions, setQuestions] = useStorageState<IQuestion[]>(
    [],
    "questions"
  );

  useEffect(() => {
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    function shuffle(a: Array<any>) {
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

      setQuestions(q);
      setCurrentIndex((prev: number) => (prev >= 0 ? prev : 0));
    };

    if (questions.length < 1) {
      loadData();
    } else {
      setCurrentIndex((prev: number) => (prev >= 0 ? prev : 0));
    }
  }, []);

  const handleChangeQuestion = (toNext: boolean) => {
    setCurrentIndex((prevIndex: number) => {
      const index = toNext ? prevIndex + 1 : prevIndex - 1;

      if (index < 0 || index >= questions.length) {
        return prevIndex;
      } else {
        return index;
      }
    });

    setRevealCorrect(false);
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setUserAnswers((prev: { [key: number]: number }) => {
      return {
        ...prev,
        [questionId]: answerIndex,
      };
    });
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="m-2 rounded-sm border bg-gray-50 p-5 shadow-sm xl:m-10">
      <div className="mb-10">
        {currentQuestion && (
          <Question
            question={currentQuestion}
            revealCorrect={revealCorrect}
            onAnswer={handleAnswer}
            userAnswer={userAnswers[currentQuestion.id]}
          />
        )}
        {!currentQuestion && <p>Loading...</p>}
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
          {currentIndex + 1} / {questions.length}
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

      <div className="mt-10 flex flex-wrap">
        {questions.map((question: IQuestion, index: number) => (
          <div key={question.id}>
            <a
              className={
                "mb-2 mr-2 block rounded-sm border px-3 py-1" +
                (userAnswers[question.id] === undefined
                  ? currentIndex === index
                    ? " border-blue-800 bg-blue-500 text-blue-100"
                    : " border-gray-300 bg-gray-100"
                  : " border-black bg-gray-200")
              }
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(index);
                setRevealCorrect(false);
              }}
            >
              {question.id}
            </a>
          </div>
        ))}
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
