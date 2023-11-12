const generatePassword = async () => {
  const length = 8;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += await charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

export { generatePassword };
