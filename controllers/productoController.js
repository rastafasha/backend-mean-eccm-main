const { response } = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const fs = require('fs');


function listarAdmin(req, res) {

    var filtro = req.params['filtro'];
    Producto.find({
        titulo: new RegExp(filtro, 'i'),
        status: ['Activo', 'Desactivado', 'Edición'],
    }, ).populate('marca').populate('categoria').sort({ createdAt: -1 }).exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}


const getProductos = async(req, res) => {

    const productos = await Producto.find().populate('titulo img categoria');

    res.json({
        ok: true,
        productos
    });
};

const destacado = async(req, res) => {

    const productos = await Producto.find('isFeatured');

    res.json({
        ok: true,
        productos
    });
};

const getProducto = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Producto.findById(id)
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar producto',
                    errors: err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El producto con el id ' + id + 'no existe',
                    errors: { message: 'No existe un producto con ese ID' }
                });

            }
            res.status(200).json({
                ok: true,
                producto: producto
            });
        });

};

const crearProducto = async(req, res) => {

    const uid = req.uid;
    const producto = new Producto({
        usuario: uid,
        ...req.body
    });

    try {

        const productoDB = await producto.save();

        res.json({
            ok: true,
            producto: productoDB
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


};

const actualizarProducto = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(500).json({
                ok: false,
                msg: 'producto no encontrado por el id'
            });
        }

        const cambiosProducto = {
            ...req.body,
            usuario: uid
        }

        const productoActualizado = await Producto.findByIdAndUpdate(id, cambiosProducto, { new: true });

        res.json({
            ok: true,
            productoActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }


};

const borrarProducto = async(req, res) => {

    const id = req.params.id;

    try {

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(500).json({
                ok: false,
                msg: 'producto no encontrado por el id'
            });
        }

        await Producto.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Producto eliminado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error hable con el admin'
        });
    }
};


function find_by_slug(req, res) {
    var slug = req.params['slug'];

    Producto.findOne({ slug: slug }).exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ producto: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

function listar_newest(req, res) {
    Producto.find().sort({ createdAt: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ data: data });
        }
    });
}

function listar_best_sellers(req, res) {
    Producto.find().sort({ ventas: -1 }).limit(8).exec((err, data) => {
        if (data) {
            res.status(200).send({ data: data });
        }
    });
}

function listar_populares(req, res) {
    Producto.find().sort({ stars: -1 }).limit(4).exec((err, data) => {
        if (data) {
            res.status(200).send({ data: data });
        }
    });
}



function listar_papelera(req, res) {

    var search = req.params['search'];

    Producto.find({ titulo: new RegExp(search, 'i'), status: 'Papelera' }).populate('marca').populate('categoria').exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                // console.log(producto_data);

                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

const cat_by_name = async(req, res) => {


    await Producto.find({}, 'categoria').filter('categoria', 'nombre').populate('titulo').exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}



function listar_cat(req, res) {
    var filtro = req.params['filtro'];

    Producto.find({ categoria: filtro, status: ['Activo', 'Desactivado', 'Edición'] }).populate('marca').populate('categoria').exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

function listar_cat_papelera(req, res) {
    var filtro = req.params['filtro'];

    Producto.find({ categoria: filtro, status: ['Papelera'] }).populate('marca').populate('categoria').exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}


function desactivar(req, res) {
    var id = req.params['id'];

    Producto.findByIdAndUpdate({ _id: id }, { status: 'Desactivado' }, (err, producto_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (producto_data) {
                res.status(200).send({ producto: producto_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el producto, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function activar(req, res) {
    var id = req.params['id'];
    // console.log(id);
    Producto.findByIdAndUpdate({ _id: id }, { status: 'Activo' }, (err, producto_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (producto_data) {
                res.status(200).send({ producto: producto_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el producto, vuelva a intentar nuevamente.' });
            }
        }
    })
}


function papelera(req, res) {
    var id = req.params['id'];

    Producto.findByIdAndUpdate({ _id: id }, { status: 'Papelera' }, (err, producto_data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            if (producto_data) {
                res.status(200).send({ producto: producto_data });
            } else {
                res.status(403).send({ message: 'No se actualizó el producto, vuelva a intentar nuevamente.' });
            }
        }
    })
}

function reducir_stock(req, res) {
    var id = req.params['id'];
    var cantidad = req.params['cantidad'];

    Producto.findById({ _id: id }, (err, producto) => {

        if (producto) {
            Producto.findByIdAndUpdate({ _id: id }, { stock: parseInt(producto.stock) - parseInt(cantidad) }, (err, data) => {
                if (data) {
                    // console.log(data);
                    res.status(200).send({ data: data });
                } else {
                    // console.log(err);
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            })
        }
    })
}

function aumentar_stock(req, res) {
    var id = req.params['id'];
    var cantidad = req.params['cantidad'];

    Producto.findById({ _id: id }, (err, producto) => {

        if (producto) {
            Producto.findByIdAndUpdate({ _id: id }, { stock: parseInt(producto.stock) + parseInt(cantidad) }, (err, data) => {
                if (data) {
                    // console.log(data);
                    res.status(200).send({ data: data });
                } else {
                    // console.log(err);
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            })
        }
    })
}

function aumentar_venta(req, res) {
    var id = req.params['id'];

    Producto.findById({ _id: id }, (err, producto) => {

        if (producto) {
            Producto.findByIdAndUpdate({ _id: id }, { ventas: parseInt(producto.ventas) + 1 }, (err, data) => {
                if (data) {
                    // console.log(data);
                    res.status(200).send({ data: data });
                } else {
                    // console.log(err);
                    res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
                }
            })
        }
    })
}





const listar_autocomplete = async(req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    Producto.find({ status: ['Activo'], }, ).populate('marca').populate('categoria').sort({ createdAt: -1 }).exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ data: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

};


function listar_general_data(req, res) {
    var filtro = req.params['filtro'];

    Producto.find({ titulo: new RegExp(filtro, 'i') }).populate('marca').populate('categoria').sort({ createdAt: -1 }).exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                // console.log(producto_data);
                // res.status(200).send({ data: producto_data });
                res.status(200).json({
                    ok: true,
                    producto_data
                });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });
}

function listar_productosCateg(req, res) {

    var filtro = req.params['filtro'];

    Producto.find({ categoria: filtro, status: ['Categoria'] }).populate('categoria').exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ productos: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

}

function list_one(req, res) {
    var id = req.params['id'];

    Producto.findOne({ _id: id }).exec((err, producto_data) => {
        if (err) {
            res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
        } else {
            if (producto_data) {
                res.status(200).send({ producto: producto_data });
            } else {
                res.status(500).send({ message: 'No se encontró ningun dato en esta sección.' });
            }
        }
    });

}






module.exports = {
    getProductos,
    crearProducto,
    getProducto,
    actualizarProducto,
    borrarProducto,
    find_by_slug,
    listar_newest,
    listar_best_sellers,
    listar_populares,
    cat_by_name,
    listar_papelera,
    listar_cat,
    listar_cat_papelera,
    desactivar,
    activar,
    papelera,
    reducir_stock,
    aumentar_stock,
    aumentar_venta,
    listarAdmin,
    listar_autocomplete,
    listar_general_data,
    listar_productosCateg,
    list_one,
    destacado


};