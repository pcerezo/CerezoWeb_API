#!/usr/bin/env node

const { Project, Technology, ProjectTechnology, ProjectImage, Category } = require('../models');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addProject() {
  const title = await askQuestion("Título: ");
  const description = await askQuestion("Descripción: ");
  const short_description = await askQuestion("Descripción Breve: ");
  const start_date = await askQuestion("Fecha de Inicio (YYYY-MM-DD): ");
  const end_date = await askQuestion("Fecha de Fin (YYYY-MM-DD): ");
  const client = await askQuestion("Cliente: ");
  const role = await askQuestion("Rol: ");
  const responsibilities = await askQuestion("Responsabilidades: ");
  const project_url = await askQuestion("URL del Proyecto: ");
  const repository_url = await askQuestion("URL del Repositorio: ");
  const status = await askQuestion("Estado: ");

  // Crear el proyecto en la base de datos
  const project = await Project.create({
    title,
    description,
    short_description,
    start_date,
    end_date,
    client,
    role,
    responsibilities,
    project_url,
    repository_url,
    status
  });

  // Añadir Tecnologías al Proyecto
  const technologies = await askQuestion("Tecnologías (separadas por coma): ");
  const techArray = technologies.split(',').map(tech => tech.trim());

  for (let techName of techArray) {
    let [technology] = await Technology.findOrCreate({ where: { name: techName } });
    await ProjectTechnology.create({ project_id: project.id, technology_id: technology.id });
  }

  // Añadir Imágenes al Proyecto
  const images = await askQuestion("URLs de Imágenes (separadas por coma): ");
  const imgArray = images.split(',').map(img => img.trim());

  for (let i = 0; i < imgArray.length; i++) {
    await ProjectImage.create({ project_id: project.id, image_url: imgArray[i], order: i + 1 });
  }

  // Añadir Categorías al Proyecto
  const categories = await askQuestion("Categorías (separadas por coma): ");
  const catArray = categories.split(',').map(cat => cat.trim());

  for (let catName of catArray) {
    let [category] = await Category.findOrCreate({ where: { name: catName } });
    await project.addCategory(category);
  }

  console.log("Proyecto añadido con éxito.");
  rl.close();
}

async function listProjects() {
  const projects = await Project.findAll({
    include: [
      { model: Technology, as: 'Technologies' },
      { model: Category, as: 'Categories' },
      { model: ProjectImage, as: 'images' }
    ]
  });
  console.log("Lista de Proyectos:");
  projects.forEach(project => {
    console.log(`- ${project.title} (${project.client})`);
    console.log(`  Tecnologías: ${project.Technologies.map(t => t.name).join(', ')}`);
    console.log(`  Categorías: ${project.Categories.map(c => c.name).join(', ')}`);
    console.log(`  Imágenes: ${project.images.map(i => i.image_url).join(', ')}`);
  });
  rl.close();
}

async function deleteProject() {
  const projectId = await askQuestion("ID del Proyecto a eliminar: ");
  await Project.destroy({ where: { id: projectId } });
  console.log("Proyecto eliminado con éxito.");
  rl.close();
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'add':
      await addProject();
      break;
    case 'list':
      await listProjects();
      break;
    case 'delete':
      await deleteProject();
      break;
    default:
      console.log("Comando no reconocido. Usa 'add', 'list', o 'delete'.");
      rl.close();
  }
}

main();
