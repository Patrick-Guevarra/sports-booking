export const money = (cents) => `$${(cents / 100).toFixed(2)}`;
export const niceType = (t) => t.replaceAll('_', ' ');
