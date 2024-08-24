const jsonServer = require('json-server');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const routes= require('./routes.json');


//Habilitar CORS
server.use(cors());

server.use(bodyParser.json());

server.use(middlewares);
server.use(jsonServer.rewriter(routes));


server.post('/login', (req, res) => {
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
server.get('/api/v1/ofertasLaborales', (req, res) => {
  const db = jsonServerRouter.db;
  const ofertasLaborales = db.get('ofertasLaborales').value();
  res.json(ofertasLaborales);
});

// Registrar una nueva oferta laboral
server.post('/api/v1/ofertasLaborales', (req, res) => {
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









server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
    });