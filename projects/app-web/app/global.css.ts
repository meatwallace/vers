import { globalFontFace, globalStyle } from '@vanilla-extract/css';

// primary - #095191
// dark - #181b26
// light - #76a5ce
// foreground - #ddefff
// background - #07080b

globalStyle('*', {
  boxSizing: 'border-box',
  margin: '0',
  padding: '0',
});

globalStyle('html, body', {
  display: 'block',
  height: '100%',
});

globalStyle('html', {
  //
});

globalStyle('body', {
  backgroundColor: '#404756',
});

globalFontFace('Josefin Sans', {
  src: [
    'url("/assets/fonts/josefin-sans-semi-bold.woff2") format("woff2")',
    'url("/assets/fonts/josefin-sans-semi-bold.woff") format("woff")',
  ],
  fontWeight: 'semi-bold',
});

globalFontFace('Josefin Slab', {
  src: [
    'url("/assets/fonts/josefin-slab-bold.woff2") format("woff2")',
    'url("/assets/fonts/josefin-slab-bold.woff") format("woff")',
  ],
  fontWeight: 'bold',
});

globalFontFace('Karla', [
  {
    src: [
      'url("/assets/fonts/karla-light.woff2") format("woff2")',
      'url("/assets/fonts/karla-light.woff") format("woff")',
    ],
    fontWeight: 'light',
  },
  {
    src: [
      'url("/assets/fonts/karla-regular.woff2") format("woff2")',
      'url("/assets/fonts/karla-regular.woff") format("woff")',
    ],
    fontWeight: 'regular',
  },
  {
    src: [
      'url("/assets/fonts/karla-bold.woff2") format("woff2")',
      'url("/assets/fonts/karla-bold.woff") format("woff")',
    ],
    fontWeight: 'bold',
  },
]);
