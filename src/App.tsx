import Question from "./components/Question";
import { IQuestion, useQuestions } from "./hooks/useQuestions";
import { useEffect, useRef, useState } from "react";
import useStorageState from "./hooks/useStorageState";

export default function App() {
  const { loadQuestions } = useQuestions();

  const [currentIndex, setCurrentIndex] = useStorageState<number>(
    -1,
    "currentIndex",
    false
  );

  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);

  const [userAnswers, setUserAnswers] = useStorageState<{
    [key: number]: number;
  }>({}, "userAnswers", false);

  const [questions, setQuestions] = useStorageState<IQuestion[]>(
    [],
    "questions",
    false
  );

  const [markedQuestions, setMarkedQuestions] = useStorageState<Array<number>>(
    [],
    "markedQuestions",
    true
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
      console.log("Loading data from server...");

      let q = await loadQuestions("./data/segeln.json");

      q = q.map((question) => {
        question.answers = shuffle(question.answers);
        return question;
      });

      setQuestions(q);
      setCurrentIndex((prev: number) => (prev >= 0 ? prev : 0));
    };

    if (questions.length < 1 || import.meta.env.MODE === "development") {
      loadData();
    } else {
      setCurrentIndex((prev: number) => (prev >= 0 ? prev : 0));
    }

    const keyCallback = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "ArrowLeft":
          handleChangeQuestion(false);
          break;

        case "ArrowRight":
          handleChangeQuestion(true);
          break;
      }
    };

    document.addEventListener("keydown", keyCallback);

    return () => {
      document.removeEventListener("keydown", keyCallback);
    };
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

  const handleMarkQuestion = (questionId: number, mark: boolean) => {
    setMarkedQuestions((prev: Array<number>) => {
      if (mark) {
        if (!prev.includes(questionId)) {
          prev = [...prev, questionId];
        }
      } else {
        prev = prev.filter((item) => item != questionId);
      }

      return prev;
    });
  };

  const currentQuestion = questions[currentIndex];

  const getQuestionClass = (
    question: IQuestion,
    index: number,
    currentIndex: number,
    userAnswers: { [key: number]: number },
    revealCorrect: boolean
  ) => {
    let retClass = "relative ";

    if (currentIndex === index) {
      retClass += "border-blue-800 bg-blue-500 text-blue-100";
    } else {
      if (userAnswers[question.id] === undefined) {
        retClass += "border-gray-300 bg-gray-100";
      } else {
        if (revealCorrect) {
          if (question.answers[userAnswers[question.id]].correct) {
            retClass += "bg-green-200 border-green-400";
          } else {
            retClass += "bg-red-200 border-red-400";
          }
        } else {
          retClass += "border-black bg-gray-200";
        }
      }
    }
    /*
"mb-2 mr-2 block rounded-sm border px-3 py-1" +
                (currentIndex === index
                  ? " border-blue-800 bg-blue-500 text-blue-100"
                  : userAnswers[question.id] === undefined
                  ? " border-gray-300 bg-gray-100"
                  : " border-black bg-gray-200") */
    return "mb-1 mr-1 block rounded-sm border px-2 py-0.5 " + retClass;
  };

  return (
    <div className="m-2 rounded-sm border bg-gray-50 p-5 shadow-sm xl:m-10">
      <div className="mb-10">
        {currentQuestion && (
          <Question
            question={currentQuestion}
            revealCorrect={revealCorrect}
            onAnswer={handleAnswer}
            userAnswer={userAnswers[currentQuestion.id]}
            isMarked={markedQuestions.includes(currentQuestion.id)}
            onMarkQuestion={handleMarkQuestion}
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

      <div className="mt-10 text-center">
        <button
          onClick={() => setRevealCorrect((rev) => !rev)}
          className={
            "px-2 py-1 text-sm " + (revealCorrect ? "bg-yellow-200" : "")
          }
        >
          Reveal correct
        </button>
      </div>

      <div className="mt-10 flex flex-wrap">
        {questions.map((question: IQuestion, index: number) => (
          <div key={question.id}>
            <a
              className={getQuestionClass(
                question,
                index,
                currentIndex,
                userAnswers,
                revealCorrect
              )}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(index);
                setRevealCorrect(false);
              }}
            >
              {question.id}
              {markedQuestions.includes(question.id) && (
                <div className="absolute bottom-[2px] left-[3px] right-[3px] border-b-2 border-b-orange-600"></div>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
