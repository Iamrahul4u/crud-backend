import express from "express";
import { ConnectDb } from "./dbConnect.js";
import ProductModel from "./productSchema.js";
import cors from "cors";
import { configDotenv } from "dotenv";
import { upload } from "./multerUpload.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
configDotenv();
app.use(express.json());
const FRONTEND_PORT = process.env.FRONTEND_PORT;

await ConnectDb();

app.use(
  cors({
    origin: FRONTEND_PORT,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.get("/api/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
});

app.post("/api/products", upload.single("imgUrl"), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      imgUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };
    const product = await ProductModel.create(productData);
    console.log(req.body);
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
