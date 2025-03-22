import xxhash from 'xxhash-wasm';

const hasher = await xxhash();

export function hashObject(object: object): string {
  return hasher.h64ToString(JSON.stringify(object));
}
