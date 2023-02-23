function truncate({ address }) {
  if (!address) return '';
  return `${address.slice(0, 5)} ... ${address.slice(-5)}`;
}

export default truncate;
