// Deterministic 2-step math problem generator for strict mode friction.
// Produces problems like "63 ÷ 7 + 14 = ?" with integer answers.

export interface MathProblem {
  expression: string;
  answer: number;
}

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateMathProblem = (): MathProblem => {
  // Step 1: pick divisor and multiplier to guarantee integer division
  const divisor = randInt(3, 9);
  const quotient = randInt(4, 12);
  const dividend = divisor * quotient;

  // Step 2: add or subtract a second term
  const useAdd = Math.random() > 0.4;
  const term = randInt(7, 24);

  const answer = useAdd ? quotient + term : quotient - term;
  const op = useAdd ? "+" : "−";
  const expression = `${dividend} ÷ ${divisor} ${op} ${term}`;

  return { expression, answer };
};
