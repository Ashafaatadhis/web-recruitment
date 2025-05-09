export const authErrorMessages: Record<string, string> = {
  user_not_found: "User not found",
  invalid_password: "Invalid password. Please try again.",
  invalid_account: "Account is invalid. Please contact support.",
  missing_credentials: "Please enter both username and password.",
  default: "An unexpected error occurred.",
};

export const getAuthErrorMessage = (errorCode?: string): string => {
  return errorCode
    ? authErrorMessages[errorCode] || authErrorMessages.default
    : authErrorMessages.default;
};
