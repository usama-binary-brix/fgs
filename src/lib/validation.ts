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

// Password validation for accounts modal (optional fields with conditional logic)
export const optionalPasswordValidationSchemaForAccounts = Yup.string()
  .test('password-requirements', 'Password is required when confirm password is provided', function(value) {
    const { password_confirmation } = this.parent;
    
    // If no password is provided but confirm password is provided, show error on password field
    if (!value && password_confirmation) {
      return this.createError({ message: 'Password is required when confirm password is provided' });
    }
    
    // If password is provided, validate it meets requirements
    if (value) {
      if (value.length < 8) {
        return this.createError({ message: 'Password must be at least 8 characters' });
      }
      
      if (value.length > 16) {
        return this.createError({ message: 'Password must be at most 16 characters' });
      }
      
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        return this.createError({ message: 'Password must contain at least one uppercase, lowercase, number and special character' });
      }
    }
    
    return true;
  });

// Confirm password validation for accounts modal (optional fields)
export const optionalConfirmPasswordValidationSchemaForAccounts = Yup.string()
  .test('password-match', 'Confirm password is required when password is provided', function(value) {
    const { password } = this.parent;
    
    // If no confirm password is provided but password is provided, show error on confirm password field
    if (!value && password) {
      return this.createError({ message: 'Confirm password is required when password is provided' });
    }
    
    // If both are provided, they must match
    if (value && password) {
      if (value !== password) {
        return this.createError({ message: 'Passwords must match' });
      }
    }
    
    return true;
  });

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