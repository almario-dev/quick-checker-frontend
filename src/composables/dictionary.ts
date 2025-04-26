export type EvaluationMode = 'enforceKey' | 'aiInference' | 'useQuestionnaire';

export const evaluationModes = [
  {
    value: 'enforceKey',
    title: 'Use Answer Key',
    description: 'Only accepts answers that match the key.',
  },
  {
    value: 'aiInference',
    title: 'AI-Based Check',
    description: 'Uses AI to evaluate answers without a key.',
  },
  {
    value: 'useQuestionnaire',
    title: 'From Questionnaire',
    description: 'Analyzes questions to infer correct answers.',
  },
] as const;
