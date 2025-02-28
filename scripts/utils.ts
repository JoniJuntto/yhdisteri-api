export const obfuscateEmail = (email: string) => {
  const [username, domain] = email.split("@");
  const obfuscatedUsername = `${username[0]}****${
    username[username.length - 1]
  }`;
  return `${obfuscatedUsername}@${domain}`;
};
