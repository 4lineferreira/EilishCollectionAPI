const express = require('express');
const router = express.Router();
const Disco = require('../models/Discos');

/**
 * @swagger
 * components:
 *   schemas:
 *     Disco:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the disco
 *         name:
 *           type: string
 *           description: The name of the disco
 *         quantity:
 *           type: number
 *           description: The quantity of the disco
 *       example:
 *         id: d5fE_asz
 *         name: Apple
 *         quantity: 10
 */

/**
 * @swagger
 * /discos:
 *   get:
 *     summary: Returns the list of all the discos
 *     tags: [Discos]
 *     responses:
 *       200:
 *         description: The list of the discos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               discos:
 *                 $ref: '#/components/schemas/Disco'
 */
router.get('/', async (req, res) => {
    try {
        const objects = await Disco.find();
        res.json(objects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /discos/{id}:
 *   get:
 *     summary: Get the disco by id
 *     tags: [Discos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The disco id
 *     responses:
 *       200:
 *         description: The disco description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disco'
 *       404:
 *         description: The disco was not found
 */
router.get('/:id', getDisco, (req, res) => {
    res.json(res.objects);
});

/**
 * @swagger
 * /discos:
 *   post:
 *     summary: Create a new disco
 *     tags: [Discos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disco'
 *     responses:
 *       201:
 *         description: The disco was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disco'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
    const disco = new Disco({
        name: req.body.name,
        quantity: req.body.quantity,
    });

    try {
        const newDisco = await disco.save();
        res.status(201).json(newDisco);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /discos/{id}:
 *   patch:
 *     summary: Update the disco by the id
 *     tags: [Discos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The disco id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disco'
 *     responses:
 *       200:
 *         description: The disco was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disco'
 *       404:
 *         description: The disco was not found
 *       500:
 *         description: Some error happened
 */
router.patch('/:id', getDisco, async (req, res) => {
    if (req.body.name != null) {
        res.disco.name = req.body.name;
    }
    if (req.body.quantity != null) {
        res.disco.quantity = req.body.quantity;
    }

    try {
        const updatedDisco = await res.disco.save();
        res.json(updatedDisco);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /discos/{id}:
 *   delete:
 *     summary: Remove the disco by id
 *     tags: [Discos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The disco id
 *     responses:
 *       200:
 *         description: The disco was deleted
 *       404:
 *         description: The disco was not found
 */
router.delete('/:id', getDisco, async (req, res) => {
    try {
        await res.disco.remove();
        res.json({ message: 'Deleted Disco' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getDisco(req, res, next) {
    let disco;
    try {
        disco = await Disco.findById(req.params.id);
        if (disco == null) {
            return res.status(404).json({ message: 'Cannot find disco' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.disco = disco;
    next();
}

module.exports = router;
