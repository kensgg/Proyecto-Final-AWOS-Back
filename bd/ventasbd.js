const ventasbd = require("./conexion").ventas;
const Venta = require("../modelos/VentaModelo");
const productosbd = require("./conexion").productos; 
const usuariosbd = require("./conexion").usuarios;  
var { validarID, validarCantidad } = require("../bd/productosbd");
var buscarUsuarios = require("../bd/usuariosbd").validarID;

async function validarDatos(venta) {
    var valido = false;
    if (venta.fechayhora != undefined && venta.id_usuario != undefined && venta.id_producto != undefined && venta.cantidad != undefined && venta.estado != undefined) {
        valido = true;
    }
    //console.log(valido);
    return valido;
}

async function obtenerNombreProducto(id_producto) {
    const producto = await productosbd.doc(id_producto).get();
    return producto.exists ? producto.data().producto : "Producto no encontrado"; 
}

async function obtenerNombreUsuario(id_usuario) {
    const usuario = await usuariosbd.doc(id_usuario).get();
    return usuario.exists ? usuario.data().usuario : "Usuario no encontrado";  
}


async function mostrarVentas() {
    const ventas = await ventasbd.get();
    const ventasvalidas = [];

    for (const venta of ventas.docs) {
        const ventaData = new Venta({ id: venta.id, ...venta.data() });

        if (ventaData.getVenta.estado === "vendido" && await validarDatos(ventaData.getVenta)) {
            const nombreProducto = await obtenerNombreProducto(ventaData.getVenta.id_producto);
            const nombreUsuario = await obtenerNombreUsuario(ventaData.getVenta.id_usuario);
            ventasvalidas.push({
                ...ventaData.getVenta,
                nombreProducto,
                nombreUsuario
            });
        }
    }

    return ventasvalidas; 
}




async function buscarPorID(id) {
    const venta = await ventasbd.doc(id).get();
    //console.log(venta);
    const venta1 = new Venta({ id: venta.id, ...venta.data() });
    var ventaValida = false;
    // console.log(venta1);
    if (validarDatosNuevos(venta1.getVenta)) {
        ventaValida = venta1.getVenta;
    }
    //console.log(ventaValida);

    return ventaValida;
}

async function validarDatosNuevos(venta) {
    var valido = false;
    if (venta.fechayhora != undefined && venta.id_usuario != undefined && venta.id_producto != undefined && venta.cantidad != undefined && venta.estado != undefined) {
        //console.log(await buscarUsuarios(venta.id_usuario));
        if (await buscarUsuarios(venta.id_usuario)) {
            if (await validarID(venta.id_producto)) {
                if (await validarCantidad(venta.id_producto, venta.cantidad)) {
                    valido = true;
                }
            }
        }
    }
    return valido;
}

async function nuevaVenta(data) {
    data.fechayhora = new Date().toLocaleString();
    data.estado = "vendido";
    const venta1 = new Venta(data);
    var ventaValida = false;
    if (await validarDatosNuevos(venta1.getVenta)) {
        await ventasbd.doc().set(venta1.getVenta);
        ventaValida = true;
    }
    return ventaValida;
}

async function modEstadoVenta(id) {
    var ventavalida = await buscarPorID(id);
    var ventaCancelada = false;
    if (ventavalida) {
        await ventasbd.doc(id).update({
            estado:"cancelado"
        });
        ventaCancelada = true;
    }
    return ventaCancelada;
}

async function modificarVenta(data) {
    const ventaValida = await buscarPorID(data.id);
    if (!ventaValida) return false;

    await ventasbd.doc(data.id).update({
        cantidad: data.cantidad,
        id_producto: data.id_producto,
        id_usuario: data.id_usuario,
    });

    return true;
}


module.exports = {
    buscarPorID,
    mostrarVentas,
    nuevaVenta,
    modEstadoVenta,
    modificarVenta
}