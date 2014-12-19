"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("userDemogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      suffix: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
      },
      birthday: {
        type: DataTypes.DATE
      },
      genderPreference: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("userDemogs").done(done);
  }
};