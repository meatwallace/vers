import { globalStyle } from '@vanilla-extract/css';

// primary - #095191
// dark - #181b26
// light - #76a5ce
// foreground - #ddefff
// background - #07080b

globalStyle('html, body', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'block',
  height: '100%',
});

globalStyle('html', {
  //
});

globalStyle('body', {
  backgroundColor: '#07080b;',
});
