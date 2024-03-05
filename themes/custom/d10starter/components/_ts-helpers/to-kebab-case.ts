const toKebabCase = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replaceAll('/', '-')
    .replaceAll(' ', '-');

export default toKebabCase;
