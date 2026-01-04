import type { TextInput } from 'react-native';

type InputMetadata = {
  keyboardName: string;
  onKeyPress?: (key: string) => void;
};

class InputRegistry {
  private registry = new WeakMap<TextInput, InputMetadata>();
  private currentInput: TextInput | null = null;

  register(input: TextInput, metadata: InputMetadata) {
    this.registry.set(input, metadata);
  }

  unregister(input: TextInput) {
    this.registry.delete(input);
    if (this.currentInput === input) {
      this.currentInput = null;
    }
  }

  setCurrentInput(input: TextInput | null) {
    this.currentInput = input;
  }

  getCurrentInput(): TextInput | null {
    return this.currentInput;
  }

  getMetadata(input: TextInput): InputMetadata | undefined {
    return this.registry.get(input);
  }

  getCurrentMetadata(): InputMetadata | undefined {
    return this.currentInput ? this.registry.get(this.currentInput) : undefined;
  }
}

export const inputRegistry = new InputRegistry();
