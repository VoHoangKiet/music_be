enum ErrorCode {
  EXIST = 1001,                  // Duplicate entry
  FAILED_VALIDATE_BODY = 1002,   // Failed to validate request body
  NOT_FOUND = 1003,              // Resource not found
  INCORRECT = 1004,              // Incorrect credentials or data
  FORBIDDEN_ERROR = 1005,        // Forbidden access
  INTERNAL_ERROR = 1006,         // Internal server error
  VERIFY_FAILED = 1007,          // Verification failed
  UNAUTHORIZED = 1008,           // Unauthorized access
  TOKEN_EXPIRED = 1009,          // Token expired
  VERIFY_EMAIL_NEED = 1010,      // Email verification required
  INVALID_FORMAT = 1011,         // Invalid input format
  MISS_PARAMS = 1012,            // Missing required parameters
  ADMIN_ISNT = 1013,             // User is not an admin
  BLOCKED = 1014,                // Account is blocked
}

export default ErrorCode;
