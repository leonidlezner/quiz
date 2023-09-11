interface IProps {}

export interface IAnswer {
  answer: string;
  correct: boolean;
  media: string;
}

export interface IQuestion {
  id: number;
  question: string;
  media: string;
  answers: Array<IAnswer>;
}

export function useQuestions() {
  const loadQuestions = async (
    questionsFile: string
  ): Promise<Array<IQuestion>> => {
    const response = await fetch(questionsFile);
    return (await response.json()) as Array<IQuestion>;
  };

  return {
    loadQuestions,
  };
}
