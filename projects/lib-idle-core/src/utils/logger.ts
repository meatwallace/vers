// TODO(#109): resolve this travesty
const isDebugEnabled = false;

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  debug: (message: string) => isDebugEnabled && console.log(message),
  info: (message: string) => console.log(message),
};
