export function nodeHasText(text: string) {
  return (_: string, node: Element | null) => node?.textContent === text;
}
