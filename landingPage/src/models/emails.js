module.exports = function (sequelize, DataTypes) {

  let Email = sequelize.define('Email', {
    email: {type: DataTypes.STRING, unique: true, validate: {isEmail: true}}
  });

  return Email;
};
