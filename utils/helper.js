function generateRandomString(length, addSmallLetters = false) {
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  if (addSmallLetters) {
    charset = `${charset}abcdefghijklmnopqrstuvwxyz`;
  }

  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
}

module.exports = {
  generateRandomString,
};
