"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("userAddresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      addressType: {
        type: DataTypes.STRING
      },
      street1: {
        type: DataTypes.STRING
      },
      street2: {
        type: DataTypes.STRING
      },
      street3: {
        type: DataTypes.STRING
      },
      apt: {
        type: DataTypes.STRING
      },
      floor: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      zip: {
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
    migration.dropTable("userAddresses").done(done);
  }
};