import { useEffect, useRef, useState } from "react";
import { useQuestions, Question } from "./hooks/useQuestions";

export default function App() {
  const { loadQuestions } = useQuestions({
    questionsFile: "./data/segeln.json",
  });

  const questions = useRef<Array<Question>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    const loadData = async () => {
      questions.current = await loadQuestions();
      setCurrentIndex(0);
    };

    loadData();
  }, []);

  return (
    <div className="bg-green-100">
      {currentIndex >= 0 && (
        <div>
          <h2>{questions.current[currentIndex].question}</h2>
          <ul>
            {questions.current[currentIndex].answers.map((answer) => (
              <li>{answer}</li>
            ))}
          </ul>
          <div className="font-bold">
            {questions.current[currentIndex].right_answer}
          </div>
        </div>
      )}
    </div>
  );
}
