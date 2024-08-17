'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    short_description: DataTypes.TEXT,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    client: DataTypes.STRING,
    role: DataTypes.STRING,
    responsibilities: DataTypes.TEXT,
    project_url: DataTypes.STRING,
    repository_url: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });

  // Relaciones con otras tablas
  Project.associate = function(models) {
    // Relación de muchos a muchos con Technology
    Project.belongsToMany(models.Technology, { through: 'ProjectTechnology', foreignKey: 'project_id'});

    // Relación uno a muchos con ProjectImage
    Project.hasMany(models.ProjectImage, {foreignKey: 'project_id', as: 'images'});

    // Relación muchos a muchos con Category
    Project.belongsToMany(models.Category, { through: 'ProjectCategory', foreignKey: 'project_id'});
  }

  return Project;
};