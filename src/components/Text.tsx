import React from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  TextProps,
  TextInputProps,
} from 'react-native';

// Drop-in replacements for RN's Text/TextInput that default to EB Garamond.
// Any style further down an element's own `style` array (e.g. theme.ts's
// `fonts.heading`/`fonts.label`/`fonts.display`, which set their own
// fontFamily) still wins, since it's merged after this base style.
const baseStyle = { fontFamily: 'EBGaramond_400Regular' };

export function Text({ style, ...props }: TextProps) {
  return <RNText style={[baseStyle, style]} {...props} />;
}

export function TextInput({ style, ...props }: TextInputProps) {
  return <RNTextInput style={[baseStyle, style]} {...props} />;
}
