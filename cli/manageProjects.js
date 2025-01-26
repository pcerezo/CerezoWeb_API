#!/usr/bin/env node
'use strict';
const Project = require('../models/project');

const readline = require('readline');
const dotenv = require('dotenv');
var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

dotenv.config();

const port = process.env.PORT || 3000;
var url = `mongodb://localhost:${port}/`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}
async function addProject() {
  const project = {
    title: await askQuestion("Título del Proyecto: "),
    description: await askQuestion("Descripción del Proyecto: "),
    short_description: await askQuestion("Descripción Corta del Proyecto: "),
    start_date: new Date(await askQuestion("Fecha de Inicio del Proyecto (YYYY-MM-DD): ")),
    end_date: await askQuestion("Fecha de Fin del Proyecto (YYYY-MM-DD): "),
    client: await askQuestion("Cliente del Proyecto: "),
    role: await askQuestion("Rol en el Proyecto: "),
    responsibilities: await askQuestion("Responsabilidades en el Proyecto: "),
    project_url: await askQuestion("URL del Proyecto: "),
    repository_url: await askQuestion("URL del Repositorio: "),
    status: await askQuestion("Estado del Proyecto: "),
    technologies: await addTechnologies(), // Llamamos a la función para añadir tecnologías
    categories: await addCategories(), // Llamamos a la función para añadir categorías
    images: await addImages(), // Llamamos a la función para añadir imágenes
  };
/**/
  mongoose.connect(`mongodb://127.0.0.1:${port}/portfolioBD`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));
/*
  const project = {
    title: "Proyecto de Prueba",
    description: "Esta es una descripción de prueba para el proyecto.",
    short_description: "Descripción corta de prueba.",
    start_date: new Date("2023-01-01"),
    end_date: new Date("2023-12-31"),
    client: "Cliente de Prueba",
    role: "Desarrollador",
    responsibilities: "Responsabilidades de prueba en el proyecto.",
    project_url: "http://proyecto-de-prueba.com",
    repository_url: "http://github.com/proyecto-de-prueba",
    status: "En progreso",
    technologies: [
      { name: "JavaScript", description: "Lenguaje de programación", logo_url: "http://logo.com/js.png" },
      { name: "Node.js", description: "Entorno de ejecución", logo_url: "http://logo.com/node.png" }
    ],
    categories: [
      { name: "Desarrollo Web", description: "Proyectos relacionados con desarrollo web" },
      { name: "Backend", description: "Proyectos relacionados con backend" }
    ],
    images: [
      { image_url: "http://images.com/img1.png", alt_text: "Imagen 1", order: 1 },
      { image_url: "http://images.com/img2.png", alt_text: "Imagen 2", order: 2 }
    ]
  };
/**/
  if (project.end_date === '') {
    project.end_date = null;
  } else {
    project.end_date = new Date(project.end_date);
  }

  try {
    /*Project.create(project, {
      include: [
        { model: Technology, as: 'Technologies' },
        { model: Category, as: 'Categories' },
        { model: ProjectImage, as: 'images' }
      ]
    });*/

    Project.create(project);

    console.log("Proyecto añadido con éxito.");
  } catch (err) {
    console.error("Error al añadir el proyecto:", err);
  } finally {
    rl.close();
  }
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

// Función para añadir tecnologías
async function addTechnologies() {
  const technologies = [];
  console.log("Introduce las tecnologías (deja el nombre vacío para terminar):");

  while (true) {
    const name = await askQuestion("Nombre de la Tecnología: ");
    if (!name) break; // Salir del bucle si el usuario no introduce un nombre

    const description = await askQuestion("Descripción de la Tecnología: ");
    const logo_url = await askQuestion("URL del Logo de la Tecnología: ");

    technologies.push({ name, description, logo_url });
  }

  return technologies;
}

// Función para añadir categorías
async function addCategories() {
  const categories = [];
  console.log("Introduce las categorías (deja el nombre vacío para terminar):");

  while (true) {
    const name = await askQuestion("Nombre de la Categoría: ");
    if (!name) break; // Salir del bucle si el usuario no introduce un nombre

    const description = await askQuestion("Descripción de la Categoría: ");

    categories.push({ name, description });
  }

  return categories;
}

// Función para añadir imágenes
async function addImages() {
  const images = [];
  console.log("Introduce las imágenes (deja el URL vacío para terminar):");

  while (true) {
    const image_url = await askQuestion("URL de la Imagen: ");
    if (!image_url) break; // Salir del bucle si el usuario no introduce una URL

    const alt_text = await askQuestion("Texto Alternativo de la Imagen: ");
    const order = parseInt(await askQuestion("Orden de la Imagen (número): "), 10);

    images.push({ image_url, alt_text, order });
  }

  return images;
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
