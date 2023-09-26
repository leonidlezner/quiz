import { useEffect, useState } from "react";
import { IQuestion } from "../hooks/useQuestions";
import Answer from "./Answer";

interface IProps {
  question: IQuestion;
  revealCorrect: boolean;
  onAnswer: CallableFunction;
  onMarkQuestion: CallableFunction;
  userAnswer: number;
  isMarked: boolean;
}

export default function Question({
  question,
  revealCorrect,
  onAnswer,
  userAnswer,
  onMarkQuestion,
  isMarked,
}: IProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const handleOnSelect = (index: number) => {
    setSelectedAnswer(index);
    onAnswer(question.id, index);
  };

  useEffect(() => {
    if (userAnswer !== undefined) {
      setSelectedAnswer(userAnswer);
    } else {
      setSelectedAnswer(-1);
    }
  }, [question.id]);

  return (
    <div>
      <div className="mb-7 flex justify-between space-x-4">
        <h2 className="text-xl xl:text-2xl">
          {question.id}: {question.question}
        </h2>
        <div className="text-right">
          {isMarked ? (
            <button
              onClick={() => {
                onMarkQuestion(question.id, false);
              }}
              className="rounded-sm bg-orange-600 px-4 py-1 text-orange-100"
            >
              Unmark
            </button>
          ) : (
            <button
              onClick={() => {
                onMarkQuestion(question.id, true);
              }}
              className="rounded-sm bg-gray-600 px-4 py-1 text-gray-100"
            >
              Mark
            </button>
          )}
        </div>
      </div>

      {question.media && (
        <div className="my-5">
          {Array.isArray(question.media) ? (
            <ul className="space-y-2">
              {question.media.map((media) => (
                <img
                  src={media}
                  /*srcSet={`${question.media} 2x`}*/
                  className="border bg-white p-1 shadow-sm"
                />
              ))}
            </ul>
          ) : (
            <img
              src={question.media}
              /*srcSet={`${question.media} 2x`}*/
              className="border bg-white p-1 shadow-sm"
            />
          )}
        </div>
      )}
      <div className="space-y-5">
        {question.answers.map((answer, index) => (
          <Answer
            key={index}
            answer={answer}
            onSelect={() => handleOnSelect(index)}
            selected={selectedAnswer === index}
            revealCorrect={revealCorrect}
          />
        ))}
      </div>
    </div>
  );
}
