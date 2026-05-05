export function formatPrice(xaf: number, currency: 'XAF' | 'USD' | 'EUR' = 'XAF'): string {
  if (currency === 'XAF') {
    return `${xaf.toLocaleString('fr-CM')} XAF`;
  }
  if (currency === 'USD') {
    const usd = xaf / 600;
    return `$${usd.toFixed(2)}`;
  }
  if (currency === 'EUR') {
    const eur = xaf / 655.96;
    return `€${eur.toFixed(2)}`;
  }
  return `${xaf} XAF`;
}

export function formatStreams(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
