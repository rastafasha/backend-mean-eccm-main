const { response } = require('express');
const Favorito = require('../models/favorites');

const getFavorites = async(req, res) => {

    const favorites = await Favorito.find();

    res.json({
        ok: true,
        favorites
    });
};

const getFavorito = (req, res) => {

    var id = req.params['id'];
    Favorito.findById({ _id: id }, (err, data_favorito) => {
        if (!err) {
            if (data_favorito) {
                res.status(200).send({ favorito: data_favorito });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });


};

const crearFavorito = async(req, res) => {

    const uid = req.uid;
    const favorito = new Favorito({
        usuario: uid,
        ...req.body
    });

    try {

        const favoritoDB = await favorito.save();

        res.json({
            ok: true,
            favorito: favoritoDB
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarFavorito = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const favorito = await Fafovrito.findById(id);
        if (!favorito) {
            return res.status(500).json({
                ok: false,
                msg: 'favorito no encontrado por el id'
            });
        }

        const cambiosFafovrito = {
            ...req.body,
            usuario: uid
        }

        const favoritoActualizado = await Fafovrito.findByIdAndUpdate(id, cambiosFavorito, { new: true });

        res.json({
            ok: true,
            favoritoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarFavorito = async(req, res) => {

    const id = req.params.id;

    try {

        const favorito = await Favorito.findById(id);
        if (!favorito) {
            return res.status(500).json({
                ok: false,
                msg: 'Favorito no encontrado por el id'
            });
        }

        await Favorito.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Favorito eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

const listarPorUsuario = (req, res) => {
    var id = req.params['id'];
    Favorito.find({ user: id }, (err, data_favorito) => {
        if (!err) {
            if (data_favorito) {
                res.status(200).send({ favoritos: data_favorito });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });
}




module.exports = {
    getFavorites,
    getFavorito,
    crearFavorito,
    actualizarFavorito,
    borrarFavorito,
    listarPorUsuario
};