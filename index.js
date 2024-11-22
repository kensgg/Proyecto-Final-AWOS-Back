const express=require("express");
const session = require("express-session");
const cors=require("cors");
const usuariosRutas=require("./rutas/rutasUsuarios");
const productosRutas=require("./rutas/rutasProductos");
const ventasRutas=require("./rutas/rutasVentas");
const { securityRules } = require("firebase-admin");

const app=express();
app.use(session({
    secret:'G3racltt',
    resave:true,
    saveUninitialized:true,
    cookie:{secure:true}
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use("/usuarios",usuariosRutas);
app.use("/productos",productosRutas);
app.use("/ventas", ventasRutas);
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("servidor en http://localhost:"+port);
    
});