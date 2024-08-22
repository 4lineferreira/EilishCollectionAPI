const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(bodyParser.json());

// Definir a porta
const PORT = process.env.PORT || 3000;

// Dados em memória (exemplo)
let objects = [];

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CRUD API',
    version: '1.0.0',
    description: 'API para demonstração de CRUD',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /discos:
 *   get:
 *     summary: Retorna todos os itens
 *     responses:
 *       200:
 *         description: Lista de itens
 */
app.get('/discos', (req, res) => {
  res.json(objects);
});

/**
 * @swagger
 * /discos:
 *   post:
 *     summary: Adiciona um novo item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item criado
 */
app.post('/discos', (req, res) => {
  const newObject = req.body;
  objects.push(newObject);
  res.status(201).json(newObject);
});

/**
 * @swagger
 * /discos/{id}:
 *   put:
 *     summary: Atualiza um item existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item atualizado
 */
app.put('/discos/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  objects[id] = updatedItem;
  res.json(updatedItem);
});

/**
 * @swagger
 * /discos/{id}:
 *   delete:
 *     summary: Remove um item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removido
 */
app.delete('/discos/:id', (req, res) => {
  const { id } = req.params;
  objects = objects.filter((_, index) => index != id);
  res.status(204).end();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
