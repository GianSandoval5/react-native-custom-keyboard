import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import {
  KeyboardProvider,
  KeyboardHost,
  InputKeyboard,
  Keyboard,
  NUMERIC_LAYOUT,
  ALPHA_LAYOUT,
  useKeyboardInput,
} from 'react-native-custom-keyboard';

export default function App() {
  const [amount, handleNumericKey, setAmount] = useKeyboardInput();
  const [name, handleAlphaKey, setName] = useKeyboardInput();
  const amountRef = React.useRef<any>(null);
  const nameRef = React.useRef<any>(null);

  return (
    <KeyboardProvider>
      <View style={[styles.container, { marginTop: 50 }]}>
        <Text style={styles.title}>🎹 Custom Keyboard PRO</Text>

        {/* Input Numérico */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>
          <InputKeyboard
            ref={amountRef}
            keyboardName="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            onCustomKeyPress={handleNumericKey}
            style={styles.input}
          />
        </View>

        {/* Input Alfabético */}
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <InputKeyboard
            ref={nameRef}
            keyboardName="alpha"
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            onCustomKeyPress={handleAlphaKey}
            style={styles.input}
          />
        </View>

        {/* Estado */}
        <View style={styles.result}>
          <Text style={styles.resultText}>Amount: {amount || '—'}</Text>
          <Text style={styles.resultText}>Name: {name || '—'}</Text>
        </View>
      </View>

      {/* 🔥 KeyboardHost - Sin hack global! */}
      <KeyboardHost>
        <Keyboard
          name="numeric"
          layout={NUMERIC_LAYOUT}
          onKeyPress={handleNumericKey}
          keyHeight={45} //opcional
          containerHeight={240} //opcional
          containerBackgroundColor="#2c4da8ff" //opcional
          keyColor="#ffffffff" //opcional
          keyPressedColor="#02a398ff" //opcional
          textColor="#000000ff" //opcional
          fontSize={20} //opcional
        />
        <Keyboard
          name="alpha"
          layout={ALPHA_LAYOUT}
          onKeyPress={handleAlphaKey}
          keyHeight={42} //opcional
          containerHeight={280} //opcional
          containerBackgroundColor="#2c4da8ff" //opcional
          keyColor="#ffffffff" //opcional
          keyPressedColor="#02a398ff" //opcional
          textColor="#000000ff" //opcional
          fontSize={16} //opcional
        />
      </KeyboardHost>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  result: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});
