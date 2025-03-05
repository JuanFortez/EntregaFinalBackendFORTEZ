// productController.js
import ProductModel from "../../models/product.model.js";

class ProductController {
  async getProducts(req, res) {
    try {
      // Extraer los query params
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const sort = req.query.sort;
      const query = req.query.query;

      // Construir el objeto de filtro
      let filter = {};
      if (query) {
        // Si query es una categoría
        if (query.startsWith("category:")) {
          filter.category = query.split(":")[1];
        }
        // Si query es sobre disponibilidad
        else if (query.startsWith("available:")) {
          filter.available = query.split(":")[1] === "true";
        }
        // Búsqueda por nombre (ejemplo)
        else {
          filter.title = { $regex: query, $options: "i" };
        }
      }

      // Construir las opciones para la paginación
      const options = {
        page,
        limit,
        lean: true, // Para obtener objetos planos de JavaScript
      };

      // Configurar sort si se proporciona
      if (sort) {
        if (sort.toLowerCase() === "asc") {
          options.sort = { price: 1 };
        } else if (sort.toLowerCase() === "desc") {
          options.sort = { price: -1 };
        }
      }

      // Realizar la búsqueda paginada
      const result = await ProductModel.paginate(filter, options);

      // Construir URLs para prev y next
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

      // Construir la respuesta según el formato especificado
      const response = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${
              sort ? `&sort=${sort}` : ""
            }${query ? `&query=${query}` : ""}`
          : null,
        nextLink: result.hasNextPage
          ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${
              sort ? `&sort=${sort}` : ""
            }${query ? `&query=${query}` : ""}`
          : null,
      };

      res.json(response);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener los productos",
        error: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.pid;
      const product = await ProductModel.findById(productId).lean();

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener el producto",
        error: error.message,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = new ProductModel(productData);
      const product = await newProduct.save();
      res.status(201).json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear el producto",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        req.body,
        { new: true }
      ).lean();

      if (!updatedProduct) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      res.json({
        status: "success",
        payload: updatedProduct,
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al actualizar el producto",
        error: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.pid;
      const deletedProduct = await ProductModel.findByIdAndDelete(
        productId
      ).lean();

      if (!deletedProduct) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      res.json({
        status: "success",
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  }
}

export default new ProductController();