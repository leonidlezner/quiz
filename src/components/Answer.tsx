import { useEffect } from "react";
import { IAnswer } from "../hooks/useQuestions";

interface IProps {
  answer: IAnswer;
  selected?: boolean;
  onSelect: CallableFunction;
  revealCorrect: boolean;
}

export default function Answer({
  answer,
  selected = false,
  onSelect,
  revealCorrect,
}: IProps) {
  const highlights = (answer: string, revealCorrect: boolean) => {
    if (revealCorrect) {
      return answer.replace(
        /\*(.*?)\*/g,
        '<span class="text-blue-500 font-semibold">$1</span>'
      );
    } else {
      return answer.replaceAll("*", "");
    }
  };

  return (
    <a
      className="block"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (!revealCorrect) {
          onSelect();
        }
      }}
    >
      <div className="flex items-center space-x-3">
        {revealCorrect && (
          <div className="h-5 w-5 shrink-0">
            {answer.correct && (
              <div className="h-5 w-5 rounded-full border border-green-800 bg-green-600"></div>
            )}
            {!answer.correct && selected && (
              <div className="h-5 w-5 rounded-full border border-red-800 bg-red-600"></div>
            )}
          </div>
        )}

        <div className="flex h-5 w-5 shrink-0 items-center rounded-full border border-gray-700 bg-gray-200">
          {selected && (
            <div className="m-auto h-3 w-3 rounded-full bg-gray-600"></div>
          )}
        </div>

        <div
          className={selected ? "font-semibold" : ""}
          dangerouslySetInnerHTML={{
            __html: highlights(answer.answer, revealCorrect),
          }}
        />
      </div>
    </a>
  );
}
