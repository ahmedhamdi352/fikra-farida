export function repeatArray<T>(arr: T[], times: number = 1): T[] {
  if (times < 1) {
    return [];
  }
  return Array(times).fill(arr).flat();
}

export function splitIntoUniqueArrays<T>(arr: T[], n: number): T[][] {
  const uniqueValues = Array.from(new Set(arr));

  if (n >= uniqueValues.length) {
    return uniqueValues.map(value => [value]);
  }

  const baseSize = Math.floor(uniqueValues.length / n);
  const remainder = uniqueValues.length % n;

  const result: T[][] = [];
  let startIndex = 0;

  for (let i = 0; i < n; i++) {
    const size = baseSize + (i < remainder ? 1 : 0);
    const subArray = uniqueValues.slice(startIndex, startIndex + size);
    if (subArray.length > 0) {
      result.push(subArray);
    }
    startIndex += size;
  }

  return result;
}
