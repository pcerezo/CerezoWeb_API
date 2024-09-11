const express = require('express');
const app = express();
const port = 3000;
const { Project, Technology, Category, ProjectImage } = require('./models');

// Middleware para manejar JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ruta para obtener la lista de proyectos con información resumida
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ['id', 'title', 'short_description', 'start_date', 'end_date', 'client', 'role'],
      include: [
        {
          model: Technology,
          as: 'Technologies',
          attributes: ['name']
        },
        {
          model: Category,
          as: 'Categories',
          attributes: ['name']
        },
        {
          model: ProjectImage,
          as: 'images',
          attributes: ['image_url', 'alt_text', 'order']
        }
      ]
    });

    res.json(projects);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
});

// Ruta para obtener los detalles de un proyecto específico
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: Technology,
          as: 'Technologies',
          attributes: ['name']
        },
        {
          model: Category,
          as: 'Categories',
          attributes: ['name']
        },
        {
          model: ProjectImage,
          as: 'images',
          attributes: ['image_url', 'alt_text', 'order']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});

/*
app.get('/tecnologias', async(req, res) => {
  try {
    const tecnologias = await Tecnologia.findAll();
    res.json(tecnologias);
  }
  catch (error) {
    res.status(500).json({error: error.message});
  }
});
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
