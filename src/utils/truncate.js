export default function ({ address }) {
  if (!address) return '';
  return `${address.slice(0, 5)} ... ${address.slice(-5)}`;
}
