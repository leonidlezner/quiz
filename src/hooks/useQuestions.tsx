interface Props {
  questionsFile: string;
}

export interface Question {
  id: number;
  question: string;
  media: string;
  answers: Array<string>;
  right_answer: string;
}

export function useQuestions({ questionsFile }: Props) {
  const loadQuestions = async (): Promise<Array<Question>> => {
    const response = await fetch(questionsFile);
    let json = (await response.json()) as Array<Question>;

    json = json.map((question) => ({
      ...question,
      right_answer: question.answers[0],
    }));

    return json;
  };

  return {
    loadQuestions,
  };
}
