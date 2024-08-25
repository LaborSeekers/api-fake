const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');


const app = express();
const jsonServerRouter = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const routes= require('./routes.json');


app.use(cors());
app.use(bodyParser.json());
app.use(middlewares);

//Habilitar CORS
app.use(jsonServer.rewriter(routes));


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Email recibido:', email);
    console.log('Password recibido:', password);
    
    // Buscar usuario por email en la base de datos
    const users = router.db.get('users').value();
    const user = users.find(u => u.email === email && u.password === password);
  
    console.log('Usuario encontrado:', user);
  
    // Verificar si el usuario existe y la contraseña coincide
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  });



// Obtener todos las ofertas laborales
app.get('/ofertasLaborales', (req, res) => {
  const db = jsonServerRouter.db;
  const ofertasLaborales = db.get('ofertasLaborales').value();
  res.json(ofertasLaborales);
});

// postular oferta laboral
app.post('/ofertasLaborales/PostularOferta', (req, res) => {
  const db = jsonServerRouter.db;
  const { userId, ofertaId } = req.body;

  // Busca al usuario por userId
  const user = db.get('users').find({ id: userId }).value();

  if (user) {
    if (!user.Postulaciones.includes(ofertaId)) {
      db.get('users')
        .find({ id: userId })
        .assign({ Postulaciones: [...user.Postulaciones, ofertaId] })
        .write();
    }
    res.status(200).json({ message: 'Postulación exitosa', postulaciones: user.Postulaciones });
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Obtener las ofertas laborales a las que un usuario se ha postulado
app.get('/ofertasLaborales/Ofertaspostuladas', (req, res) => {
  const db = jsonServerRouter.db;
  const userId = parseInt(req.query.userId, 10);
  console.log("xdxdxdxd");
  // Busca el usuario por ID
  const usuario = db.get('users').find({ id: userId }).value();
  if (usuario && usuario.Postulaciones && usuario.Postulaciones.length > 0) {
    // Filtra las ofertas laborales que están en la lista de postulaciones del usuario
    const ofertasLaborales = db.get('ofertasLaborales').filter(oferta => usuario.Postulaciones.includes(oferta.id)).value();
    res.json(ofertasLaborales);
  } else {
    res.status(404).json({ message: 'No se encontraron ofertas postuladas para este usuario' });
  }
});




// Registrar una nueva oferta laboral
app.post('/ofertasLaborales', (req, res) => {
  const db = jsonServerRouter.db;

  const {    logo, puesto, location, salary, type, reputacion, fecha, estado, descripcion, requisitos, beneficios, puestoIMG, jornadaIMG, ubicacionIMG,
    sueldoIMG } = req.body;

  if (!logo || !puesto || !location || !salary || !type || !reputacion||!fecha||!estado||!descripcion||!requisitos||!beneficios||!puestoIMG||!jornadaIMG||!ubicacionIMG||!sueldoIMG) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: logo, puesto, location, salary, type, reputacion, fecha, estado, descripcion, requisitos, beneficios' });
  }

  const newOfertaLaboral = {
    id: db.get('ofertasLaborales').value().length + 1,
    logo,
    puesto,
    location,
    salary,
    type,
    reputacion,
    fecha,
    estado,
    descripcion,
    requisitos,
    beneficios,
    puestoIMG,
    jornadaIMG,
    ubicacionIMG,
    sueldoIMG
  };

  db.get('ofertasLaborales').push(newOfertaLaboral).write();

  res.json(newOfertaLaboral);
});


app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
    });