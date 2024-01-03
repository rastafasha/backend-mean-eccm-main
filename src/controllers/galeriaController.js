const { response } = require('express');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const Galeria = require('../models/galeria');

const getGalerias = async(req, res) => {

    const galerias = await Galeria.find().populate('imagen producto');

    res.json({
        ok: true,
        galerias
    });
};

const getGaleria = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Galeria.findById(id)
        .exec((err, galeria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Galeria',
                    errors: err
                });
            }
            if (!galeria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Galeria con el id ' + id + 'no existe',
                    errors: { message: 'No existe un Galeria con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                galeria: galeria
            });
        });


};


const actualizarGaleria = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const galeria = await Galeria.findById(id);
        if (!galeria) {
            actualizarImagen();
            return res.status(500).json({
                ok: false,
                msg: 'galeria no encontrado por el id'
            });
        }

        const cambiosGaleria = {
            ...req.body,
            usuario: uid
        }

        const galeriaActualizado = await Galeria.findByIdAndUpdate(id, cambiosGaleria, { new: true });



        res.json({
            ok: true,
            galeriaActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarGaleria = async(req, res) => {

    const id = req.params.id;

    try {

        const galeria = await Galeria.findById(id);
        if (!galeria) {
            return res.status(500).json({
                ok: false,
                msg: 'Galeria no encontrado por el id'
            });
        }

        await Galeria.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Galeria eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};



const findByProduct = (req, res) => {
    var id = req.params['id'];

    console.log(id);
    if (id == 'null') {
        Galeria.find().exec((err, galeria_data) => {
            if (err) {
                res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
            } else {
                if (galeria_data) {
                    res.status(200).send({ galeria: galeria_data });
                } else {
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            }
        });
    } else {
        Galeria.find({ producto: id }).exec((err, galeria_data) => {
            if (err) {
                res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
            } else {
                if (galeria_data) {
                    res.status(200).send({ galeria: galeria_data });
                } else {
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            }
        });
    }

}

const registro = (req, res, next) => {
    var params = req.body;

    actualizarImagen();

    // if (req.files.imagenes) {

    //     req.files.imagenes.forEach((elem, index) => {
    //         // console.log(elem);

    //         var imagen_path = elem.path;
    //         var name = imagen_path.split('\\');
    //         var imagen_name = name[2];

    //         var galeria = new Galeria();
    //         galeria.producto = params.producto;
    //         galeria.imagen = imagen_name;



    //         galeria.save((err, img_save) => {
    //             if (err) {
    //                 res.status(500).send({ error: err });
    //             }
    //         });

    //     });
    //     res.status(200).send({ message: "Registrado" });
    // }
}



module.exports = {
    getGalerias,
    actualizarGaleria,
    borrarGaleria,
    getGaleria,
    findByProduct,
    registro
};