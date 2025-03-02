import express from "express";
import hadlebars from "express-handlebars";
import __dirname from "./util.js";
import mongoose from "mongoose";
import cartRouter from "./routes/cartRouter.js";
import productRouter from "./routes/productRouter.js";

// Declarando Express para usar sus funciones.
const app = express();

// Preparar la configuración del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas estáticas para archivos públicos
app.use(express.static(__dirname + "/public"));

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", hadlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Declaración de Routers
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

// Ruta principal
app.get("/", (req, res) => {
  res.render("home");
});

const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
  console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/pizzeria?retryWrites=true&w=majority"
    );
    console.log("Conectado con éxito a MongoDB usando Mongoose.");

    // console.log("ESTO es la data: ", dataOrders.default);

    // 01_ Damos de alta la info de orders en la base de datos
    // await ordersModel.insertMany(dataOrders.default);

    // 02_ Listamos información de la base de datos
    // let orders = await ordersModel.find()
    // console.log("Ordenes en la BD: ", orders);

    /* =====================================
        =               Section  02           =
        ===================================== */
    reportesFunc();
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Mongoose: " + error);
    process.exit();
  }
};
connectMongoDB();

let reportesFunc = async () => {
  let orders = await ordersModel.aggregate([
    // Stage 1: Filtrar las ordenes por tamaño, en este caso solo pizzas medianas:
    {
      $match: { size: "medium" },
    },

    // Stage 2: Agrupar por sabores y acumular el número de ejemplares de cada sabor:
    {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } },
    },

    // Stage 3: Ordenar los documentos ya agrupados de mayor a menor.
    {
      $sort: { totalQuantity: -1 },
    },

    // Stage 4: Guardar todos los documentos generados de la agregación en un nuevo documento
    //         dentro de un arreglo. Para no dejarlos sueltos en la colección.
    //         $push indica que se guarda en un array, y $$ROOT inserta todo el documento.
    {
      $group: { _id: 1, orders: { $push: "$$ROOT" } },
    },

    // Stage 5: Creamos nuestro proyecto (documento) a partir del array de datos.
    {
      $project: {
        _id: 0,
        orders: "$orders",
      },
    },

    // Stage FINAL (se crea una colección --> reports)
    {
      $merge: { into: "resportes_pizzas_2025" },
    },
  ]);

  console.log("Resultados de la agregación:");
  console.log(orders);
};
