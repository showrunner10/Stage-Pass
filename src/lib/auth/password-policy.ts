const PASSWORD_POLICY_MESSAGE =
  'Use at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number.';

export function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function passwordPolicyMessage() {
  return PASSWORD_POLICY_MESSAGE;
}
