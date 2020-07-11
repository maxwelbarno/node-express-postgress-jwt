const create = (email, password) => {
  return `INSERT INTO users(email, password, created_on) values('${email}', '${password}', current_timestamp)`;
};

export default create;
