/*'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
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
};*/

'use strict';
const mongoose = require('mongoose');

const Technology = new mongoose.Schema({ 
  name: String, 
  description: String, 
  logo_url: String 
});

const Category = new mongoose.Schema({
  name: String,
  description: String
});

const ProjectImage = new mongoose.Schema({ 
  image_url: String, 
  alt_text: String, 
  order: Number 
});

const Project = new mongoose.Schema({
  title: String,
  description: String,
  short_description: String,
  start_date: Date,
  end_date: Date,
  client: String,
  role: String,
  responsibilities: String,
  project_url: String,
  repository_url: String,
  status: String,
  technologies: [Technology],
  categories: [Category],
  images: [ProjectImage]
});

const ProjectModel = mongoose.model('Projects', Project);

module.exports = ProjectModel;