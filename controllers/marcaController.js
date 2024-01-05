const { response } = require('express');
const Marca = require('../models/marca');

const getMarcas = async(req, res) => {

    const marcas = await Marca.find().populate('nombre img descripcion');

    res.json({
        ok: true,
        marcas
    });
};

const getMarca = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Marca.findById(id)
    .populate('producto')
        .exec((err, marca) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar marca',
                    errors: err
                });
            }
            if (!marca) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El marca con el id ' + id + 'no existe',
                    errors: { message: 'No existe un marca con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                marca: marca
            });
        });


    // res.json({
    //     ok: true,
    //     marca
    //     //uid: req.uid
    // });
};

const crearMarca = async(req, res) => {

    const uid = req.uid;
    const marca = new Marca({
        usuario: uid,
        ...req.body
    });

    try {

        const marcaDB = await marca.save();

        res.json({
            ok: true,
            marca: marcaDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarMarca = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const marca = await Marca.findById(id);
        if (!marca) {
            return res.status(500).json({
                ok: false,
                msg: 'Marca no encontrado por el id'
            });
        }

        const cambiosMarca = {
            ...req.body,
            usuario: uid
        }

        const marcaActualizado = await Marca.findByIdAndUpdate(id, cambiosMarca, { new: true });

        res.json({
            ok: true,
            marcaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarMarca = async(req, res) => {

    const id = req.params.id;

    try {

        const marca = await Marca.findById(id);
        if (!marca) {
            return res.status(500).json({
                ok: false,
                msg: 'marca no encontrado por el id'
            });
        }

        await Marca.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Marca eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};

module.exports = {
    getMarcas,
    crearMarca,
    actualizarMarca,
    borrarMarca,
    getMarca
};