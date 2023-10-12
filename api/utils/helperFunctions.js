function validateEmail(email) {
  if (!email) return null

  return String(email)
    .toLowerCase()
    .match(
      // * Same regex than <input type='email' />. Getting into syntactical email validation is a one way road to hell. We'll rely on token validation sent to the email address instead
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
}

module.exports = {
  validateEmail
}