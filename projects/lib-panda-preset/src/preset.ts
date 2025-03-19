import { definePreset } from '@pandacss/dev';
import defaultPreset from '@pandacss/dev/presets';

export const preset = definePreset({
  conditions: {
    invalid: '&:is([aria-invalid=true])',
    unchecked: '&:is([data-unchecked])',
  },
  globalCss: {
    html: {
      '--global-color-border': 'colors.neutral.400',
      '--global-color-placeholder': 'colors.gray.500',
      '--global-font-body': 'Karla, sans-serif',
      '--global-font-heading': 'Josefin Sans, sans-serif',
      '--global-font-mono': 'Fira Mono, monospace',
    },
  },
  globalFontface: {
    'Fira Mona': {
      fontDisplay: 'swap',
      fontStyle: 'normal',
      fontWeight: 400,
      src: [
        'url(/assets/fonts/fira-mono-regular.woff) format("woff")',
        'url(/assets/fonts/fira-mono-regular.woff2) format("woff2")',
      ],
    },
    'Josefin Sans': {
      fontDisplay: 'swap',
      fontStyle: 'normal',
      fontWeight: 600,
      src: [
        'url(/assets/fonts/josefin-sans-semi-bold.woff) format("woff")',
        'url(/assets/fonts/josefin-sans-semi-bold.woff2) format("woff2")',
      ],
    },
    Karla: [
      {
        fontDisplay: 'swap',
        fontStyle: 'normal',
        fontWeight: 300,
        src: [
          'url(/assets/fonts/karla-light.woff) format("woff")',
          'url(/assets/fonts/karla-light.woff2) format("woff2")',
        ],
      },
      {
        fontDisplay: 'swap',
        fontStyle: 'normal',
        fontWeight: 400,
        src: [
          'url(/assets/fonts/karla-regular.woff) format("woff")',
          'url(/assets/fonts/karla-regular.woff2) format("woff2")',
        ],
      },
      {
        fontDisplay: 'swap',
        fontStyle: 'normal',
        fontWeight: 700,
        src: [
          'url(/assets/fonts/karla-bold.woff) format("woff")',
          'url(/assets/fonts/karla-bold.woff2) format("woff2")',
        ],
      },
    ],
  },
  globalVars: {
    '--font-fira-code': 'Fira Mono, monospace',
    '--font-josefin-sans': 'Josefin Sans, sans-serif',
    '--font-karla': 'Karla, sans-serif',
  },
  name: 'vers-preset',
  presets: [defaultPreset],
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%, 70%, 100%': { opacity: 1 },
          '20%, 50%': { opacity: 0 },
        },
      },
      tokens: {
        colors: {
          birch: {
            100: { value: '#ece5db' },
            200: { value: '#dcd0ba' },
            300: { value: '#c5b491' },
            400: { value: '#ad996e' },
            50: { value: '#f7f4ee' },
            500: { value: '#927e50' },
            600: { value: '#73633d' },
            700: { value: '#594f32' },
            800: { value: '#48402c' },
            900: { value: '#3a3525' },
            950: { value: '#211e12' },
          },
        },
        fonts: {
          fira: { value: 'var(--font-fira-code), Menlo, monospace' },
          josefin: { value: 'var(--font-josefin-sans), sans-serif' },
          karla: { value: 'var(--font-karla), sans-serif' },
        },
      },
    },
  },
});
