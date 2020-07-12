const create = (email, password) => `INSERT INTO users(email, password, created_on) values('${email}', '${password}', localtimestamp)`;

const find = (email) => `SELECT * FROM users WHERE email='${email}'`;

const read = () => 'SELECT * FROM users';

const updateTokens = (email, token, expiry) => `UPDATE users SET password_reset_token='${token}', reset_password_token_expires='${expiry}' WHERE email='${email}'`;

export {
  create, find, read, updateTokens
};
