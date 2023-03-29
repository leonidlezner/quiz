import { useEffect, useState } from "react";
import { IQuestion } from "../hooks/useQuestions";
import Answer from "./Answer";

interface IProps {
  question: IQuestion;
  revealCorrect: boolean;
}

export default function Question({ question, revealCorrect }: IProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const handleOnSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  useEffect(() => {
    setSelectedAnswer(-1);
  }, [question.id]);

  return (
    <div>
      <h2 className="mb-10 text-2xl">{question.question}</h2>
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
