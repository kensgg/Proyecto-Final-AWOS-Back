var rutas = require("express").Router();
const { ventas } = require("../bd/conexion");
var { mostrarVentas, buscarPorID, modEstadoVenta, nuevaVenta, modificarVenta } = require("../bd/ventasbd");
var productosbd = require("../bd/conexion").productos;
var usuariosbd = require("../bd/conexion").usuarios;

// Rutas para las ventas
rutas.get("/", async (req, res) => {
    var ventasvalidas = await mostrarVentas();
    res.json(ventasvalidas);
});

rutas.get("/buscarPorId/:id", async (req, res) => {
    var ventaValida = await buscarPorID(req.params.id);
    res.json(ventaValida);
});

rutas.patch("/ventaModificada/:id", async (req, res) => {
    var ventaModificada = await modEstadoVenta(req.params.id);
    res.json(ventaModificada);
});

rutas.post("/nuevaVenta", async (req, res) => {
    var ventaValida = await nuevaVenta(req.body);
    res.json(ventaValida);
});

rutas.post("/modificarVenta", async (req, res) => {
    var ventaModificada = await modificarVenta(req.body);
    res.json(ventaModificada);
});

rutas.get("/sugerirProducto", async (req, res) => {
    const nombreProducto = req.query.producto;
    if (!nombreProducto || nombreProducto.length < 2) {
        return res.status(400).json({ error: "El nombre del producto debe tener al menos 2 caracteres." });
    }

    try {
        const productosSugeridos = await buscarProductosPorNombre(nombreProducto);
        res.json(productosSugeridos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

async function buscarProductosPorNombre(nombre) {
    const productos = await productosbd.where("producto", ">=", nombre)
                                       .where("producto", "<=", nombre + "\uf8ff")
                                       .get();

    if (productos.empty) {
        return [];
    }

    const productosSugeridos = productos.docs.map(doc => ({
        id: doc.id,
        producto: doc.data().producto 
    }));

    return productosSugeridos;
}



// Rutas para sugerencias de usuarios
rutas.get("/sugerirUsuario", async (req, res) => {
    const nombreUsuario = req.query.nombre;

    if (!nombreUsuario || nombreUsuario.length < 2) {
        return res.status(400).json({ error: "El nombre del usuario debe tener al menos 2 caracteres." });
    }

    try {
        const usuariosSugeridos = await buscarUsuariosPorNombre(nombreUsuario);
        res.json(usuariosSugeridos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los usuarios." });
    }
});

async function buscarUsuariosPorNombre(nombre) {
    const usuarios = await usuariosbd.where("nombre", ">=", nombre).where("nombre", "<=", nombre + "\uf8ff").get();

    if (usuarios.empty) {
        return [];
    }

    const usuariosSugeridos = usuarios.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre
    }));

    return usuariosSugeridos;
}

module.exports = rutas;
