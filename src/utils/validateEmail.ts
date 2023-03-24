export const validateEmail = (email: string) => {
  const emailRegex = new RegExp(/^(\w)+([.-]?\w+)*@(\w)+([.-]?\w+)*(\.\w+)+$/);
  const isValid_email = emailRegex.test(email);
  let alertMessage_email = '';

  if (email === '') {
    alertMessage_email = 'Input required! Please enter your email.';
  } else if (isValid_email) {
    alertMessage_email = 'Email valid';
  } else {
    alertMessage_email = 'Email not valid. Please enter an email in the format personal_info@domain.com.';
  }
  return { isValid_email, alertMessage_email };
};