const { response } = require('express');
const Promocion = require('../models/promocion');

const getPromocions = async(req, res) => {

    const promocions = await Promocion.find().populate('first_title img producto_title');

    res.json({
        ok: true,
        promocions
    });
};

const getPromocion = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Promocion.findById(id)
        .exec((err, promocion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Promocion',
                    errors: err
                });
            }
            if (!promocion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Promocion con el id ' + id + 'no existe',
                    errors: { message: 'No existe un Promocion con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                promocion: promocion
            });
        });

};

const crearPromocion = async(req, res) => {

    const uid = req.uid;
    const promocion = new Promocion({
        usuario: uid,
        ...req.body
    });

    try {

        const promocionDB = await promocion.save();

        res.json({
            ok: true,
            promocion: promocionDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarPromocion = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const promocion = await Promocion.findById(id);
        if (!promocion) {
            return res.status(500).json({
                ok: false,
                msg: 'promocion no encontrado por el id'
            });
        }

        const cambiosPromocion = {
            ...req.body,
            usuario: uid
        }

        const promocionActualizado = await Promocion.findByIdAndUpdate(id, cambiosPromocion, { new: true });

        res.json({
            ok: true,
            promocionActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarPromocion = async(req, res) => {

    const id = req.params.id;

    try {

        const promocion = await Promocion.findById(id);
        if (!promocion) {
            return res.status(500).json({
                ok: false,
                msg: 'promocion no encontrado por el id'
            });
        }

        await Promocion.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'promocion eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

module.exports = {
    getPromocions,
    crearPromocion,
    actualizarPromocion,
    borrarPromocion,
    getPromocion
};