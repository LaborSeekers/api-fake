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



server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
    });