export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function removeRandomItem<T>(array: T[]): {
  removed: T;
  remaining: T[];
} {
  const index = Math.floor(Math.random() * array.length);
  const removed = array[index];
  const remaining = [...array.slice(0, index), ...array.slice(index + 1)];
  return { removed, remaining };
}
