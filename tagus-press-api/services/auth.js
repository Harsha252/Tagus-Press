const bcrypt = require("bcryptjs");

const comparePasswordHash = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generatePasswordHash = password => {
  return bcrypt.genSalt(10).then(salt => {
    return bcrypt.hash(password, salt);
  });
};

module.exports = { comparePasswordHash, generatePasswordHash };
