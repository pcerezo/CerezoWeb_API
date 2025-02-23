const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const ProjectModel = require('./models/project');
const nodemailer = require('nodemailer');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cors({
  origin: '*', // Permitir cualquier origen
}));
// Middleware para manejar JSON
app.use(express.json());

// Conexión a la base de datos
mongoose.connect(`mongodb://127.0.0.1:${port}/portfolioBD`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

  mongoose.connection.on('connected', () => console.log('Conectado a MongoDB'));
  mongoose.connection.on('error', (err) => console.error('Error al conectar a MongoDB:', err));

const transporter = nodemailer.createTransport({
  service: 'gmail', // o cualquier otro servicio
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_CODE // tu contraseña
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Ruta para obtener la lista de proyectos con información resumida
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
});

// Ruta para obtener los detalles de un proyecto específico
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ error: 'Error al obtener el proyecto' });
  }
});


// Enviar correo de solicitud de producción musical
app.post('/api/enviarCorreo', async(req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Detalles del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_DESTINO,
    subject: "Mensaje enviado desde el portafolio por " + nombre,
    text: "Tienes un mensaje enviado desde el portafolio de parte de " + nombre + " cuyo correo es " + email + ". \n\n" 
      + "\"" + mensaje + "\""
  };

  // Envío del correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo: ' + error);
      res.status(500).json({status: 500, message: 'Error al enviar el correo: ' + error});
    } else {
      console.log('Correo enviado: ' + info.response);
      res.status(200).json({status: 200, message: 'Correo enviado'});
    }
  });
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
