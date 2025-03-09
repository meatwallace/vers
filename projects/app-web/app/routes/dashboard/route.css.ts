import { style } from '@vanilla-extract/css';

export const container = style({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '1140px',
  paddingLeft: '24px',
  paddingRight: '24px',
  width: '100%',
});

export const worldsContainer = style({
  backgroundColor: '#a4abbd',
  // alignItems: 'center',
  // justifyContent: 'center',
  borderRadius: '8px',
  boxShadow:
    'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;',
  display: 'flex',
  flexFlow: 'column',
  minHeight: '300px',
  paddingBottom: '16px',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '16px',
  width: '100%',
});

export const worldsHeader = style({
  fontFamily: 'Josefin Sans, sans-serif',
  fontSize: '24px',
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
  alignItems: 'flex-start',
  backgroundColor: '#ffeecb',
  borderRadius: '8px',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'flex-end',
  marginBottom: '8px',
  marginLeft: '4px',
  marginRight: '4px',
  minHeight: '200px',
  paddingBottom: '8px',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '8px',
  width: '160px',
});

export const worldName = style({
  fontFamily: 'Josefin Sans, serif',
  fontSize: '18px',
});

export const singleLine = style({
  // display: 'block',
  whiteSpace: 'nowrap',
});

export const worldID = style({
  fontFamily: 'Josefin Slab, serif',
  fontSize: '12px',
});

export const updatedAtLabel = style({
  fontFamily: 'Josefin Slab, serif',
  fontSize: '12px',
  fontWeight: 500,
});

export const updatedAt = style({
  fontFamily: 'Josefin Slab, serif',
  fontSize: '12px',
});

export const deleteWorldButton = style({
  //
});

export const noWorldsContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'column',
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
