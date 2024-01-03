const { response } = require('express');
const Contacto = require('../models/contacto');

function getContactos(req, res) {
    Contacto.find().sort({ createdAt: -1 }).exec((err, data) => {
        if (data) {
            res.status(200).send({ data: data });
        }
    });
}

const getContacto = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Contacto.findById(id)
        .exec((err, contacto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Contacto',
                    errors: err
                });
            }
            if (!contacto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Contacto con el id ' + id + 'no existe',
                    errors: { message: 'No existe un Contacto con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                contacto: contacto
            });
        });
};

const crearContacto = (req, res) => {

    let data = req.body;

    var contacto = new Contacto;
    contacto.nombres = data.nombres;
    contacto.mensaje = data.mensaje;
    contacto.tema = data.tema;
    contacto.correo = data.correo;
    contacto.telefono = data.telefono;



    contacto.save((err, data) => {
        if (!err) {
            if (data) {
                res.status(200).send({ data: data });
            } else {
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: err });
        }
    });


};


const borrarContacto = async(req, res) => {

    const id = req.params.id;

    try {

        const contacto = await Contacto.findById(id);
        if (!contacto) {
            return res.status(500).json({
                ok: false,
                msg: 'contacto no encontrado por el id'
            });
        }

        await Contacto.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'contacto eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};





module.exports = {
    getContactos,
    crearContacto,
    borrarContacto,
    getContacto,
};