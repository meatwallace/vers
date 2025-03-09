import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '1140px',
  margin: '0 auto',
  height: '100%',
  paddingLeft: '24px',
  paddingRight: '24px',
});

export const worldsContainer = style({
  display: 'flex',
  backgroundColor: '#a4abbd',
  boxShadow:
    'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;',
  width: '100%',
  minHeight: '300px',
  // alignItems: 'center',
  // justifyContent: 'center',
  borderRadius: '8px',
  flexFlow: 'column',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '16px',
  paddingBottom: '16px',
});

export const worldsHeader = style({
  fontSize: '24px',
  fontFamily: 'Josefin Sans, sans-serif',
  marginBottom: '16px',
});

export const createWorldButton = style({
  marginLeft: 'auto',
  //
});

export const worldsList = style({
  display: 'flex',
  // justifyContent: 'center',
  // alignItems: 'center',
  flexFlow: 'row wrap',
  marginBottom: '16px',
});

export const worldsListItem = style({
  backgroundColor: '#ffeecb',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  flexFlow: 'column',
  minHeight: '200px',
  borderRadius: '8px',
  marginRight: '4px',
  marginLeft: '4px',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '8px',
  paddingBottom: '8px',
  width: '160px',
  marginBottom: '8px',
});

export const worldName = style({
  fontSize: '18px',
  fontFamily: 'Josefin Sans, serif',
});

export const singleLine = style({
  // display: 'block',
  whiteSpace: 'nowrap',
});

export const worldID = style({
  fontSize: '12px',
  fontFamily: 'Josefin Slab, serif',
});

export const updatedAtLabel = style({
  fontSize: '12px',
  fontFamily: 'Josefin Slab, serif',
  fontWeight: 500,
});

export const updatedAt = style({
  fontSize: '12px',
  fontFamily: 'Josefin Slab, serif',
});

export const deleteWorldButton = style({
  //
});

export const noWorldsContainer = style({
  display: 'flex',
  flexFlow: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

export const noWorldsText = style({
  color: '#07080b',
  fontFamily: 'Karla',
  fontSize: '24px',
  marginBottom: '16px',
});

export const noWorldCreateWorldButton = style({
  //
});
