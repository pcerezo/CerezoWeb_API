'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Technology extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Technology.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    logo_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Technology',
  });

  // Relaciones con otras tablas
  Technology.associate = function(models) {
    // Relación muchos a muchos con Project
    Technology.belongsToMany(models.Project, {through: 'ProjectTechnology', foreignKey:'technology_id'});
  }

  return Technology;
};