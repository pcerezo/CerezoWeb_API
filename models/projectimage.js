'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectImage.init({
    project_id: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    alt_text: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectImage',
  });

  // Relaciones con otras tablas
  ProjectImage.associate = function(models) {
    // Relación con Project
    ProjectImage.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project'});
  };

  return ProjectImage;
};