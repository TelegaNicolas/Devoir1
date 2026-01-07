const Product = require("../models/product.model");

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ total: products.length, data: products });
  } catch (e) {
    next(e);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const product = await Product.createOne({ name, price });
    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.updateOne(Number(req.params.id), req.body);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const ok = await Product.deleteOne(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: "Produit non trouvé" });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
