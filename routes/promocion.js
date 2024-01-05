/*
 Ruta: /api/promocions
 */

const { Router } = require('express');
const router = Router();
const { getPromocions, crearPromocion, actualizarPromocion, borrarPromocion, getPromocion } = require('../controllers/promocionController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getPromocions);

router.post('/', [
    validarJWT,
    check('producto_title', 'El nombre del marca es necesario').not().isEmpty(),
    validarCampos
], crearPromocion);

router.put('/:id', [
    validarJWT,
    check('producto_title', 'El nombre del marca es necesario').not().isEmpty(),
    validarCampos
], actualizarPromocion);

router.delete('/:id', validarJWT, borrarPromocion);

router.get('/:id', getPromocion);


module.exports = router;