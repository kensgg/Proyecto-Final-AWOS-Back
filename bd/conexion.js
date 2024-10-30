const admin = require("firebase-admin");
const keys = require("../Keys.json");

admin.initializeApp({
    credential: admin.credential.cert(keys)
});

const proyecto = admin.firestore();

const usuarios = proyecto.collection("usuario");
const productos = proyecto.collection("producto");
const ventas = proyecto.collection("venta");

// Consulta a la colección "usuario"
usuarios.get()
    .then((snapshot) => {
        if (snapshot.empty) {
            console.log('No hay usuarios encontrados.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch(err => {
        console.error('Error obteniendo usuarios:', err);
    });


productos.get()
    .then((snapshot) => {
        if (snapshot.empty) {
            console.log('No hay producto encontrados.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch(err => {
        console.error('Error obteniendo productos:', err);
    });

ventas.get()
    .then((snapshot) => {
        if (snapshot.empty) {
            console.log('No hay ventas encontrados.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch(err => {
        console.error('Error obteniendo ventas:', err);
    });

    
module.exports = {
    usuarios,
    productos,
    ventas
};
