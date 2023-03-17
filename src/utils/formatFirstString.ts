export default function formatFirstStringToUpperCase(string: string) {
  return `${string.charAt(0).toUpperCase()}${string
    .slice(1)
    .toLocaleLowerCase()}`;
}
