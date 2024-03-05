/**
 * Creates a new array from `mockData` param's elements, of length specified by `count` param.
 * (Just repeatedly iterates over the `mockData` array as needed.)
 */
const itemsFromCount = <T>(
  // using `ReadonlyArray` allows for passing in both normal arrays and Readonly ones
  mockData: ReadonlyArray<T>,
  count?: number,
  /** Defaults to 1 */
  min?: number
): T[] => {
  if (!mockData.length) return [];
  const items: T[] = [];
  const n = Math.max(Number(count), Number(min) || 1);
  while (items.length < n) {
    const item = mockData[items.length % mockData.length];
    if (item) items.push(item);
  }
  return items;
};

export default itemsFromCount;
