const bcrypt = require("bcryptjs");
exports.hashPassword = (passowrd) => {
  const salt = bcrypt.genSaltSync(15);
  return bcrypt.hashSync(passowrd, salt);
};

exports.compareHashPassword = (oldpassword, hashpassword) => {
  return bcrypt.compareSync(oldpassword, hashpassword);
};
