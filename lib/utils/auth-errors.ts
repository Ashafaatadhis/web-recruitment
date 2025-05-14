export const authErrorMessages: Record<string, string> = {
  user_not_found: "Invalid email or password. Please try again.", // Also made this generic for consistency
  invalid_password: "Invalid email or password. Please try again.", // Changed to be more generic
  invalid_account: "Account is invalid. Please contact support.",
  missing_credentials: "Please enter both email and password.", // Assuming email is used now
  EmailNotVerified:
    "Your email address is not verified. Please check your email for a verification link.",
  default: "An unexpected error occurred.",
};

export const getAuthErrorMessage = (errorCode?: string): string => {
  return errorCode
    ? authErrorMessages[errorCode] || authErrorMessages.default
    : authErrorMessages.default;
};
