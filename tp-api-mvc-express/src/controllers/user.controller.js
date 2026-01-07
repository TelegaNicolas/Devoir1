const User = require("../models/user.model");

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ total: users.length, data: users });
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const user = await User.createOne({ name, age });
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.updateOne(Number(req.params.id), req.body);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const ok = await User.deleteOne(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
