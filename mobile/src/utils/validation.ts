/**
 * Input Validation Utilities
 * Client-side validation for forms
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - adjust regex for your region
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): { valid: boolean; message?: string } => {
  if (name.trim().length < 1) {
    return { valid: false, message: 'Name is required' };
  }
  if (name.trim().length > 50) {
    return { valid: false, message: 'Name must not exceed 50 characters' };
  }
  return { valid: true };
};

export const validateIncidentTitle = (title: string): { valid: boolean; message?: string } => {
  if (title.trim().length < 5) {
    return { valid: false, message: 'Title must be at least 5 characters' };
  }
  if (title.trim().length > 200) {
    return { valid: false, message: 'Title must not exceed 200 characters' };
  }
  return { valid: true };
};

export const validateIncidentDescription = (description: string): { valid: boolean; message?: string } => {
  if (description.trim().length < 20) {
    return { valid: false, message: 'Description must be at least 20 characters' };
  }
  if (description.trim().length > 2000) {
    return { valid: false, message: 'Description must not exceed 2000 characters' };
  }
  return { valid: true };
};

export const validateLocation = (address: string): { valid: boolean; message?: string } => {
  if (address.trim().length < 1) {
    return { valid: false, message: 'Location address is required' };
  }
  return { valid: true };
};
