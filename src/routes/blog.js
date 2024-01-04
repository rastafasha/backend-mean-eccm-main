/*
 Ruta: /api/blogs
 */

const { Router } = require('express');
const router = Router();
const {
    getBlogs,
    getBlog,
    crearBlog,
    actualizarBlog,
    borrarBlog,
    desactivar,
    activar

} = require('../controllers/blogController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

router.get('/', getBlogs);

router.post('/', [
    validarJWT,
    check('titulo', 'El nombre es necesario').not().isEmpty(),
    validarCampos
], crearBlog);

router.put('/:id', [
    validarJWT,
    check('titulo', 'El nombre es necesario').not().isEmpty(),
    validarCampos
], actualizarBlog);

router.delete('/:id', validarJWT, borrarBlog);

router.get('/:id', getBlog);

router.get('/blog_admin/admin/desactivar/:id', validarJWT, desactivar);
router.get('/blog_admin/admin/activar/:id', validarJWT, activar);

module.exports = router;