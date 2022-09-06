export const validateEmail = (email: string) => {
  const emailRegex = new RegExp(/^(\w)+([.-]?\w+)*@(\w)+([.-]?\w+)*(\.\w+)+$/);
  const isValid_email = emailRegex.test(email);
  let alertMessage_email = '';

  if (email === null || email === '') {
    alertMessage_email = 'Input required! Please enter your email.';
  } else if (isValid_email) {
    alertMessage_email = 'Email valid';
  } else {
    alertMessage_email = 'Email not valid. Please enter an email in the format personal_info@domain.com.';
  }
  return { isValid_email, alertMessage_email };
};

export const validatePassword = (password: string) => {
  const passwordRegex = new RegExp(/^([\w!@#$%&*]){6,}$/);
  const isValid_password = passwordRegex.test(password);
  let alertMessage_password = '';

  if (password === null || password === '') {
    alertMessage_password = 'Input required! Please choose a password.';
  } else if (isValid_password) {
    alertMessage_password = 'Password valid';
  } else {
    alertMessage_password = 'Password not valid. Your password should contain at least 6 chacteres e may contain letters, numbers and the characters @ # $ % & *';
  }
  return { isValid_password, alertMessage_password };
};