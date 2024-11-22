const admin = require("firebase-admin");
const keys = require("../Keys.json");

admin.initializeApp({
    credential: admin.credential.cert(keys)
});

const proyecto = admin.firestore();

const usuarios = proyecto.collection("usuario");
const productos = proyecto.collection("producto");
const ventas = proyecto.collection("venta");


    
module.exports = {
    usuarios,
    productos,
    ventas
};
