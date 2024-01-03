/*
 Ruta: /api/color
 */

const { Router } = require('express');
const router = Router();
const {
    getContactos,
    crearContacto,
    borrarContacto,
    getContacto,
} = require('../../controllers/contactoController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getContactos);

router.post('/', [
    check('nombres', 'El nombres del categoria es necesario').not().isEmpty(),
    validarCampos
], crearContacto);


router.delete('/:id', validarJWT, borrarContacto);

router.get('/:id', validarJWT, getContacto);


module.exports = router;