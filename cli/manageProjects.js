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
  var end_date = await askQuestion("Fecha de Fin (YYYY-MM-DD): ");
  if (end_date == '') {
    end_date = null;
  }
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

async function editProject() {
  const projectId = await askQuestion("ID del Proyecto a editar: ");

  // Verificar si el proyecto existe
  const project = await Project.findByPk(projectId, {
    include: [
      { model: Technology, as: 'Technologies' },
      { model: Category, as: 'Categories' },
      { model: ProjectImage, as: 'images' }
    ]
  });

  if (!project) {
    console.log("Proyecto no encontrado.");
    rl.close();
    return;
  }

  // Mostrar los valores actuales del proyecto y preguntar por cambios
  console.log("Deja el campo vacío si no quieres modificarlo.");

  const newTitle = await askQuestion(`Nuevo título (${project.title}): `);
  const newDescription = await askQuestion(`Nueva descripción (${project.description}): `);
  const newShortDescription = await askQuestion(`Nueva descripción breve (${project.short_description}): `);
  const newStartDate = await askQuestion(`Nueva fecha de inicio (${project.start_date}): `);
  var newEndDate = await askQuestion(`Nueva fecha de fin (${project.end_date ? project.end_date : 'null'}): `);
  if (newEndDate == '') {
    newEndDate = project.end_date;
  }
  const newClient = await askQuestion(`Nuevo cliente (${project.client}): `);
  const newRole = await askQuestion(`Nuevo rol (${project.role}): `);
  const newResponsibilities = await askQuestion(`Nuevas responsabilidades (${project.responsibilities}): `);
  const newProjectUrl = await askQuestion(`Nueva URL del proyecto (${project.project_url}): `);
  const newRepositoryUrl = await askQuestion(`Nueva URL del repositorio (${project.repository_url}): `);
  const newStatus = await askQuestion(`Nuevo estado (${project.status}): `);

  // Actualizar el proyecto con los nuevos valores (si se han proporcionado)
  await project.update({
    title: newTitle || project.title,
    description: newDescription || project.description,
    short_description: newShortDescription || project.short_description,
    start_date: newStartDate || project.start_date,
    end_date: newEndDate || project.end_date,
    client: newClient || project.client,
    role: newRole || project.role,
    responsibilities: newResponsibilities || project.responsibilities,
    project_url: newProjectUrl || project.project_url,
    repository_url: newRepositoryUrl || project.repository_url,
    status: newStatus || project.status
  });

  // Tecnologías
  const editTechnologies = await askQuestion(`¿Quieres modificar las tecnologías? (Actuales: ${project.Technologies.map(t => t.name).join(', ')}) (sí/no): `);
  if (editTechnologies.toLowerCase() === 'sí' || editTechnologies.toLowerCase() === 'si') {
    const newTechnologies = await askQuestion("Nuevas tecnologías (separadas por coma): ");
    const techArray = newTechnologies.split(',').map(tech => tech.trim());

    // Primero, eliminar las relaciones actuales
    await ProjectTechnology.destroy({ where: { project_id: project.id } });

    // Añadir nuevas tecnologías
    for (let techName of techArray) {
      let [technology] = await Technology.findOrCreate({ where: { name: techName } });
      await ProjectTechnology.create({ project_id: project.id, technology_id: technology.id });
    }
    console.log("Tecnologías actualizadas.");
  }

  // Imágenes
  const editImages = await askQuestion(`¿Quieres modificar las imágenes? (Actuales: ${project.images.map(i => i.image_url).join(', ')}) (sí/no): `);
  if (editImages.toLowerCase() === 'sí' || editImages.toLowerCase() === 'si') {
    const newImages = await askQuestion("Nuevas URLs de imágenes (separadas por coma): ");
    const imgArray = newImages.split(',').map(img => img.trim());

    // Primero, eliminar las imágenes actuales
    await ProjectImage.destroy({ where: { project_id: project.id } });

    // Añadir nuevas imágenes
    for (let i = 0; i < imgArray.length; i++) {
      await ProjectImage.create({ project_id: project.id, image_url: imgArray[i], order: i + 1 });
    }
    console.log("Imágenes actualizadas.");
  }

  // Categorías
  const editCategories = await askQuestion(`¿Quieres modificar las categorías? (Actuales: ${project.Categories.map(c => c.name).join(', ')}) (sí/no): `);
  if (editCategories.toLowerCase() === 'sí' || editCategories.toLowerCase() === 'si') {
    const newCategories = await askQuestion("Nuevas categorías (separadas por coma): ");
    const catArray = newCategories.split(',').map(cat => cat.trim());

    // Eliminar relaciones actuales de categorías
    await project.setCategories([]);

    // Añadir nuevas categorías
    for (let catName of catArray) {
      let [category] = await Category.findOrCreate({ where: { name: catName } });
      await project.addCategory(category);
    }
    console.log("Categorías actualizadas.");
  }

  console.log("Proyecto actualizado con éxito.");
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
    case 'edit':
      await editProject();
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
