'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectTechnology extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectTechnology.init({
    project_id: DataTypes.INTEGER,
    technology_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectTechnology',
  });

  return ProjectTechnology;
};