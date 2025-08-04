import * as Yup from "yup";

// Strong password validation schema
export const passwordValidationSchema = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one uppercase, lowercase, number and a special character"
  )
  .required("Password is required");

// Confirm password validation schema
export const confirmPasswordValidationSchema = Yup.string()
  .oneOf([Yup.ref("password")], "Passwords must match")
  .required("Please confirm your password");

// Password validation for settings pages (optional fields)
export const optionalPasswordValidationSchema = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one uppercase, lowercase, number and special character"
  );

// Confirm password validation for settings pages (optional fields)
export const optionalConfirmPasswordValidationSchema = Yup.string()
  .oneOf([Yup.ref("new_password")], "Passwords must match");

// Password strength indicator function
export const getPasswordStrength = (password: string): {
  strength: "weak" | "medium" | "strong";
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push("At least 8 characters");
  } else {
    score += 1;
  }

  if (password.length > 16) {
    feedback.push("Maximum 16 characters");
  } else {
    score += 1;
  }

  if (!/(?=.*[a-z])/.test(password)) {
    feedback.push("One lowercase letter");
  } else {
    score += 1;
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    feedback.push("One uppercase letter");
  } else {
    score += 1;
  }

  if (!/(?=.*\d)/.test(password)) {
    feedback.push("One number");
  } else {
    score += 1;
  }

  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    feedback.push("One special character");
  } else {
    score += 1;
  }

  let strength: "weak" | "medium" | "strong";
  if (score <= 2) {
    strength = "weak";
  } else if (score <= 4) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return { strength, score, feedback };
}; 