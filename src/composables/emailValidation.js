export default function useIsCorrectEmailFormat(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)$/;
  const isCorrectEmailFormat = emailRegex.test(email);
  return isCorrectEmailFormat;
}
