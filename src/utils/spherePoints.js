const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const DEG = 180 / Math.PI


export function getPoint(i, n) {
  const y = 1 - (2 * (i + 0.5)) / n
  return { lat: Math.asin(y) * DEG, lon: GOLDEN * i * DEG }
}