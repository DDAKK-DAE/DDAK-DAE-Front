export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateNickname(nickname: string): boolean {
  return nickname.length > 0 && nickname.length <= 50;
}
