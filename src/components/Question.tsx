import { useEffect, useState } from "react";
import { IQuestion } from "../hooks/useQuestions";
import Answer from "./Answer";

interface IProps {
  question: IQuestion;
  revealCorrect: boolean;
  onAnswer: CallableFunction;
  userAnswer: number;
}

export default function Question({
  question,
  revealCorrect,
  onAnswer,
  userAnswer,
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
      <h2 className="mb-7 text-xl xl:text-2xl">
        {question.id}: {question.question}
      </h2>
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
