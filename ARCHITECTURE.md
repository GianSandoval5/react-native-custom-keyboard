# Architecture Documentation

## Overview

React Native Custom Keyboard provides a clean, type-safe architecture for implementing custom in-app keyboards. The library follows React best practices with proper separation of concerns.

## Core Components

### InputRegistry

Manages the relationship between TextInput components and their associated keyboards using WeakMap for automatic memory management.

```typescript
class InputRegistry {
  private registry = new WeakMap<TextInput, InputMetadata>();
  private currentInput: TextInput | null = null;
  
  register(input, metadata) { ... }
  unregister(input) { ... }
  getCurrentMetadata() { ... }
}
```

**Benefits:**
- Automatic garbage collection
- No memory leaks
- Clean separation of concerns

### KeyboardHost

Separate component responsible for:
- Rendering the animated keyboard container
- Selecting the correct keyboard based on `activeKeyboard`
- Managing animations with React Native Animated API
- Automatic safe area handling with SafeAreaProvider
- Dynamic height adjustment per keyboard

**Props:**
- `height`: Default height for all keyboards (optional)
- `backgroundColor`: Default background color for all keyboards (optional)

### InputKeyboard Component

Flutter-inspired API for declarative keyboard assignment:

```tsx
<InputKeyboard
  keyboardName="numeric"
  onCustomKeyPress={(key) => console.log(key)}
  placeholder="Enter amount"
/>
```

**Features:**
- Automatic registration with InputRegistry
- Native keyboard suppression (`showSoftInputOnFocus={false}`)
- Automatic show/hide on focus/blur
- Full forwardRef compatibility
- Blur tracking to prevent keyboard hiding on key press

### Keyboard Component

Highly customizable keyboard layout renderer with independent styling:

```tsx
<Keyboard
  name="numeric"
  layout={NUMERIC_LAYOUT}
  onKeyPress={(key) => handleKey(key)}
  keyHeight={50}
  containerHeight={280}
  containerBackgroundColor="#000000"
  keyColor="#1e3a8a"
  keyPressedColor="#3b82f6"
  textColor="#ffffff"
  fontSize={20}
/>
```

**Props:**
- `name`: Unique identifier for keyboard routing (required)
- `layout`: Array of key rows (required)
- `onKeyPress`: Callback for key press events (required)
- `keyHeight`: Individual key height (optional)
- `containerHeight`: Total keyboard container height (optional)
- `containerBackgroundColor`: Keyboard background color (optional)
- `keyColor`: Default key background color (optional)
- `keyPressedColor`: Key color when pressed (optional)
- `textColor`: Key text color (optional)
- `fontSize`: Key text font size (optional)

## Component Hierarchy

```tsx
<KeyboardProvider>
  {/* Your app components */}
  <InputKeyboard keyboardName="numeric" />
  <InputKeyboard keyboardName="alpha" />
  
  {/* Keyboard host container with safe area */}
  <KeyboardHost height={280} backgroundColor="#f5f5f5">
    <Keyboard 
      name="numeric" 
      layout={NUMERIC_LAYOUT}
      onKeyPress={handleNumericKey}
      keyHeight={45}
      containerHeight={260}
      containerBackgroundColor="#000000"
      keyColor="#1e3a8a"
    />
    <Keyboard 
      name="alpha" 
      layout={ALPHA_LAYOUT}
      onKeyPress={handleAlphaKey}
      containerHeight={350}
    />
  </KeyboardHost>
</KeyboardProvider>
```

## Data Flow

1. User focuses on `InputKeyboard`
2. `InputKeyboard` registers itself with `inputRegistry`
3. `showKeyboard(name)` updates `activeKeyboard` in context
4. `KeyboardHost` renders only the active `<Keyboard>`
5. User presses key → `onCustomKeyPress` callback fires
6. Parent component handles the input state

## Predefined Layouts

The library includes battle-tested keyboard layouts:

### NUMERIC_LAYOUT
3x4 grid with digits 0-9 and backspace (⌫):
```typescript
[
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '⌫']
]
```

### ALPHA_LAYOUT
Full QWERTY keyboard with:
- Numbers row: 1 2 3 4 5 6 7 8 9 0
- Spanish alphabet: Including Ñ
- Space bar: 3x wider with ␣ visual indicator
- Punctuation: . , @ ;
- Backspace: ⌫

## useKeyboardInput Hook

Simplifies keyboard input handling:

```typescript
const [value, handleKeyPress, setValue] = useKeyboardInput();

// Automatically handles:
// - Backspace (⌫) to remove last character
// - Character concatenation
// - State management
```

**Returns:**
- `value`: Current input string
- `handleKeyPress`: Callback for Keyboard onKeyPress
- `setValue`: Direct state setter for programmatic updates

## Design Principles

- **No global state pollution**: Uses WeakMap for clean references
- **Separation of concerns**: Each component has a single responsibility
- **Type safety**: Full TypeScript support throughout
- **Declarative API**: Flutter-inspired component interface
- **Performance**: Native Animated API with automatic cleanup
- **Platform support**: Automatic safe area handling for iOS/Android
- **Customization**: Independent styling per keyboard
- **Zero config**: Predefined layouts for immediate use

## API Surface

```typescript
// Components
export { KeyboardProvider }  // Context provider
export { KeyboardHost }       // Keyboard container with safe area
export { InputKeyboard }      // Smart text input
export { Keyboard }           // Keyboard layout

// Hooks
export { useKeyboard }        // Keyboard controls
export { useKeyboardContext } // Direct context access
export { useKeyboardInput }   // Simplified input handling

// Predefined Layouts
export { NUMERIC_LAYOUT }     // 0-9 + backspace
export { ALPHA_LAYOUT }       // Full QWERTY + Ñ + numbers + space

// Advanced
export { inputRegistry }      // Input management system
```

## Future Enhancements

Potential features for future versions:
- Controlled value mode for InputKeyboard
- Gesture-based keyboard dismissal
- Haptic feedback integration
- Keyboard lifecycle events (onShow, onHide)
- Sound effects on key press
- Keyboard animation customization
- Swipe gestures for special characters
