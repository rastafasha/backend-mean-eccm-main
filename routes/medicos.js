/*
 Ruta: /api/medicos
 */

const { Router } = require('express');
const router = Router();
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', validarJWT, getMedicos);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser valido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser valido').isMongoId(),
    validarCampos
], actualizarMedico);

router.get('/:id', validarJWT, getMedicoById);

router.delete('/:id', validarJWT, borrarMedico);


module.exports = router;