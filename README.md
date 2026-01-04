# react-native-custom-keyboard

[![npm version](https://img.shields.io/npm/v/react-native-custom-keyboard.svg)](https://www.npmjs.com/package/react-native-custom-keyboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A fully customizable in-app keyboard for React Native with smooth animations, multiple layouts, and a clean API inspired by Flutter.

## Features

✨ **Declarative API** - Flutter-inspired component interface  
🎨 **Fully Customizable** - Complete control over keyboard layouts, colors, and styling  
⚡ **Smooth Animations** - Native animations at 60fps performance  
🔒 **Type Safe** - Written in TypeScript with full type definitions  
📱 **Multiple Keyboards** - Support for multiple keyboard types in one app  
♻️ **Memory Efficient** - WeakMap-based architecture prevents memory leaks  
🔧 **Predefined Layouts** - Ready-to-use numeric and alphabetic keyboards  
📦 **Zero Config** - Works out of the box with automatic safe area handling  

## Installation

```sh
npm install react-native-custom-keyboard react-native-safe-area-context
```

**Or with yarn:**
```sh
yarn add react-native-custom-keyboard react-native-safe-area-context
```

## Quick Start

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
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

  return (
    <KeyboardProvider>
      <View style={styles.container}>
        <Text>Amount</Text>
        <InputKeyboard
          keyboardName="numeric"
          value={amount}
          onChangeText={setAmount}
          onCustomKeyPress={handleNumericKey}
          placeholder="Enter amount"
          style={styles.input}
        />

        <Text>Name</Text>
        <InputKeyboard
          keyboardName="alpha"
          value={name}
          onChangeText={setName}
          onCustomKeyPress={handleAlphaKey}
          placeholder="Enter name"
          style={styles.input}
        />

        {/* Host del teclado (al final del layout) */}
        <KeyboardHost>
          <Keyboard name="numeric" layout={NUMERIC_LAYOUT} onKeyPress={handleNumericKey} />
          <Keyboard name="alpha" layout={ALPHA_LAYOUT} onKeyPress={handleAlphaKey} />
        </KeyboardHost>
      </View>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});
```

## Architecture

- **`KeyboardProvider`** - Context provider for keyboard state management
- **`InputKeyboard`** - Smart TextInput with automatic keyboard association
- **`KeyboardHost`** - Container that renders the active keyboard
- **`Keyboard`** - Customizable keyboard component with flexible layouts
- **`inputRegistry`** - Internal WeakMap-based registration system

## Multiple Keyboards

```tsx
import { NUMERIC_LAYOUT, ALPHA_LAYOUT } from 'react-native-custom-keyboard';

<KeyboardHost>
  <Keyboard 
    name="numeric" 
    layout={NUMERIC_LAYOUT}
    containerBackgroundColor="#000"
    keyColor="#1e3a8a"
    keyHeight={50}
  />
  <Keyboard 
    name="alpha" 
    layout={ALPHA_LAYOUT}
    containerBackgroundColor="#16213e"
    keyColor="#0f172a"
    keyHeight={45}
  />
</KeyboardHost>

<InputKeyboard keyboardName="numeric" />
<InputKeyboard keyboardName="alpha" />
```

## API Reference

### `<InputKeyboard />`

A TextInput component with automatic keyboard association.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `keyboardName` | `string` | ✅ | Unique identifier for the keyboard to display |
| `onCustomKeyPress` | `(key: string) => void` | ❌ | Callback fired when a key is pressed |
| `...TextInputProps` | `TextInputProps` | ❌ | All standard React Native TextInput props |

```tsx
<InputKeyboard
  keyboardName="numeric"
  onCustomKeyPress={(key) => console.log(key)}
  placeholder="Enter amount"
  style={styles.input}
/>
```

### `<KeyboardHost />`

Container component that hosts and animates keyboards. Automatically handles safe area.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | ✅ | `<Keyboard />` components to manage |
| `height` | `number` | ❌ | Default height for keyboards (default: 280) |
| `backgroundColor` | `string` | ❌ | Default background color (default: '#111') |

```tsx
<KeyboardHost height={300} backgroundColor="#000">
  <Keyboard name="numeric" layout={...} />
  <Keyboard name="alpha" layout={...} />
</KeyboardHost>
```

### `<Keyboard />`

Customizable keyboard component with flexible layouts and styling.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✅ | Unique identifier matching `InputKeyboard.keyboardName` |
| `layout` | `string[][]` | ✅ | 2D array defining key layout (rows and columns) |
| `onKeyPress` | `(key: string) => void` | ❌ | Callback fired when a key is pressed |
| `keyHeight` | `number` | ❌ | Height of each key in pixels (default: 56) |
| `containerHeight` | `number` | ❌ | Total container height (overrides KeyboardHost height) |
| `containerBackgroundColor` | `string` | ❌ | Background color of keyboard container |
| `keyColor` | `string` | ❌ | Background color of keys (default: '#222') |
| `keyPressedColor` | `string` | ❌ | Key color when pressed (default: '#333') |
| `textColor` | `string` | ❌ | Text color on keys (default: '#fff') |
| `fontSize` | `number` | ❌ | Font size of key text (default: 18) |

```tsx
<Keyboard
  name="numeric"
  layout={NUMERIC_LAYOUT}
  onKeyPress={(key) => console.log(key)}
  keyHeight={50}
  containerHeight={260}
  containerBackgroundColor="#000"
  keyColor="#1e3a8a"
  keyPressedColor="#3b82f6"
  textColor="#ffffff"
  fontSize={20}
/>
```

### `useKeyboardInput()`

Hook that simplifies keyboard input handling with built-in backspace support.

**Returns:** `[value: string, handleKeyPress: (key: string) => void, setValue: (value: string) => void]`

```tsx
const [amount, handleAmountKey, setAmount] = useKeyboardInput('');

<InputKeyboard
  value={amount}
  onChangeText={setAmount}
  onCustomKeyPress={handleAmountKey}
  keyboardName="numeric"
/>
```

### `useKeyboard()`

Hook for programmatic keyboard control.

```tsx
const { showKeyboard, hideKeyboard, activeKeyboard } = useKeyboard();

// Show a specific keyboard
showKeyboard('numeric');

// Hide current keyboard
hideKeyboard();

// Check active keyboard
console.log(activeKeyboard); // 'numeric' | null
```

## Predefined Layouts

The library includes two ready-to-use keyboard layouts:

### `NUMERIC_LAYOUT`

Standard numeric keypad (3x4 grid):
```tsx
import { NUMERIC_LAYOUT } from 'react-native-custom-keyboard';

// Layout:
// 1 2 3
// 4 5 6
// 7 8 9
// . 0 ⌫
```

### `ALPHA_LAYOUT`

Full QWERTY keyboard with Spanish support:
```tsx
import { ALPHA_LAYOUT } from 'react-native-custom-keyboard';

// Layout:
// 1 2 3 4 5 6 7 8 9 0
// Q W E R T Y U I O P
// A S D F G H J K L Ñ
// Z X C V B N M ⌫
// . , ␣ @ ;
```

## Advanced Usage

### Custom Styling

Each keyboard can have independent styling:

```tsx
<KeyboardHost>
  {/* Dark blue numeric keyboard */}
  <Keyboard
    name="numeric"
    layout={NUMERIC_LAYOUT}
    containerHeight={240}
    containerBackgroundColor="#0a0e27"
    keyColor="#1e3a8a"
    keyPressedColor="#3b82f6"
    textColor="#ffffff"
    fontSize={22}
    keyHeight={55}
  />
  
  {/* Custom alpha keyboard */}
  <Keyboard
    name="alpha"
    layout={ALPHA_LAYOUT}
    containerHeight={280}
    containerBackgroundColor="#16213e"
    keyColor="#0f172a"
    keyPressedColor="#1e293b"
    textColor="#e2e8f0"
    fontSize={16}
    keyHeight={42}
  />
</KeyboardHost>
```

### Custom Layouts

Create your own keyboard layouts:

```tsx
const CUSTOM_LAYOUT = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['.', '␣', '⌫'], // '' = empty space, ␣ = spacebar, ⌫ = backspace
];

<Keyboard
  name="custom"
  layout={CUSTOM_LAYOUT}
  onKeyPress={handleCustomKey}
/>
```

### Direct Registry Access

For advanced use cases, you can access the input registry directly:

```tsx
import { inputRegistry } from 'react-native-custom-keyboard';

// Get current active input
const currentInput = inputRegistry.getCurrentInput();

// Get metadata for current input
const metadata = inputRegistry.getCurrentMetadata();
```

## Examples

Check out the [example](./example) directory for a complete working demo with multiple keyboard types.

## Performance

- **Smooth animations** at 60fps using React Native Animated API
- **Memory efficient** with WeakMap-based architecture
- **Optimized rendering** with conditional component mounting
- **Zero memory leaks** through automatic cleanup
- **Automatic safe area handling** for notch/gesture devices

## Requirements

- React Native >= 0.70
- react-native-safe-area-context >= 4.0.0

## Troubleshooting

### Native keyboard appears
Make sure your `InputKeyboard` component automatically applies `showSoftInputOnFocus={false}`. This is handled internally.

### Keyboard doesn't respect safe area
Safe area is handled automatically by `KeyboardHost`. Make sure you're wrapping your keyboards with `<KeyboardHost>`.

### TypeScript errors
All components are fully typed. Make sure you're using TypeScript >= 4.5 for best compatibility.

## Additional Documentation

For deeper technical insights:

- 📐 **[Architecture](ARCHITECTURE.md)** - Design principles, component hierarchy, and system architecture
- ✅ **[Verification](VERIFICATION.md)** - Complete checklist of tested features and platform support

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details.

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Author

Built with ❤️ for the React Native community by **[GianSandoval5](https://github.com/GianSandoval5)**

If you find this library helpful, consider:
- ⭐ Starring the repo
- 🐛 Reporting issues
- 🚀 Contributing improvements
- 📢 Sharing with the community

Follow me on GitHub for more React Native libraries and tools!

## License

MIT © [GianSandoval5](https://github.com/GianSandoval5)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
