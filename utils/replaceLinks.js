module.exports = (str) => {
  const pattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return str.replace(pattern, "<a href='$1' target='_blank'>$1</a>");
};
