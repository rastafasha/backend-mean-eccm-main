/*
 Ruta: /api/favoritos
 */

 const { Router } = require('express');
 const router = Router();
 const {
 
    getFavorites,
    getFavorito,
    crearFavorito,
    actualizarFavorito,
    borrarFavorito,
    listarPorUsuario
 } = require('../controllers/favoritoController');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const { validarCampos } = require('../middlewares/validar-campos');
 
 
 router.get('/', getFavorites);
 router.get('/favoritos/:id', getFavorito);
 router.get('/favoritos/user/:id', listarPorUsuario);
 
 router.post('/favoritos/registro', [
     validarJWT,
     validarCampos
 ], crearFavorito);
 
 router.put('/favoritos/update/:id', [
     validarJWT,
     validarCampos
 ], actualizarFavorito);
 
 router.delete('/favoritos/remove/:id', validarJWT, borrarFavorito);
 
 
 
 
 
 module.exports = router;