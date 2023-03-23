export function formatFirstStringToUpperCase(string: string) {
  return `${string.charAt(0).toUpperCase()}${string
    .slice(1)
    .toLocaleLowerCase()}`;
}

export function formatFirstStringToLowerCase(string: string) {
  return `${string.charAt(0).toLocaleLowerCase()}${string.slice(1)}`;
}
