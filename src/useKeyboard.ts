import { useKeyboardContext } from './KeyboardProvider';

export const useKeyboard = () => {
  const { showKeyboard, hideKeyboard, activeKeyboard } = useKeyboardContext();

  return {
    showKeyboard,
    hideKeyboard,
    activeKeyboard,
  };
};
