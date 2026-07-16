export function validateFirstName(firstName: string): string {
    firstName = firstName.trim();
  
    if (!firstName) {
      return "First name is required.";
    }
  
    if (firstName.length < 2) {
      return "First name must be at least 2 characters.";
    }
  
    if (firstName.length > 30) {
      return "First name cannot exceed 30 characters.";
    }
  
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(firstName)) {
      return "First name can contain only letters.";
    }
  
    return "";
  }
  export function validateLastName(lastName: string): string {
    lastName = lastName.trim();
  
    if (!lastName) {
      return "Last name is required.";
    }
  
    if (lastName.length < 2) {
      return "Last name must be at least 2 characters.";
    }
  
    if (lastName.length > 30) {
      return "Last name cannot exceed 30 characters.";
    }
  
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(lastName)) {
      return "Last name can contain only letters.";
    }
  
    return "";
  }


  export function validateUsername(username: string): string {
    username = username.trim();
  
    if (!username) {
      return "Username is required.";
    }
  
    if (username.length < 4) {
      return "Username must be at least 4 characters.";
    }
  
    if (username.length > 20) {
      return "Username cannot exceed 20 characters.";
    }
  
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      return "Only letters, numbers and underscore are allowed.";
    }
  
    return "";
  }

  export function validateEmail(email: string): string {
    email = email.trim();
  
    if (!email) {
      return "Email is required.";
    }
  
    if (email.length > 100) {
      return "Email cannot exceed 50 characters.";
    }
  
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  
    if (!emailRegex.test(email)) {
      return "Enter a valid email address.";
    }
  
    return "";
  }

  export function validatePassword(password: string): string {
    if (!password) {
      return "Password is required.";
    }
  
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }
  
    if (password.length > 32) {
      return "Password cannot exceed 32 characters.";
    }
  
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
  
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
  
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
  
    return "";
  }

  export function validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string {
    if (!confirmPassword) {
      return "Confirm password is required.";
    }
  
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
  
    return "";
  }
  export function validateLogin(login: string): string {
    login = login.trim();
  
    if (!login) {
      return "Username or email is required.";
    }
  
    if (login.length < 3) {
      return "Username or email must be at least 3 characters.";
    }
  
    if (login.length > 100) {
      return "Username or email cannot exceed 30 characters.";
    }
  
    return "";
  }