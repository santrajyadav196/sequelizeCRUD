"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Post}) {
      // define association here
      this.hasMany(Post, {foreignKey: "userId", as: "post"});
    }
    toJSON() {
      return {...this.get(), id: undefined};
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "User must have name."},
          notEmpty: {msg: "name nust not be empty."},
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "User must have email."},
          notEmpty: {msg: "email nust not be empty."},
          isEmail: {msg: "email must be valid."},
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: "User must have role."},
          notEmpty: {msg: "role nust not be empty."},
        },
      },
    },
    {
      sequelize,
      tablename: "users",
      modelName: "User",
    }
  );
  return User;
};
