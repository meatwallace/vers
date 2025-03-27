// TODO(#109): resolve this travesty
const isDebugEnabled = false;

export const logger = {
  debug: (message: string) => isDebugEnabled && console.log(message),
  info: (message: string) => console.log(message),
};
