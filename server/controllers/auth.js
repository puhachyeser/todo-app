const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateJwt = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class AuthController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

      const candidate = await User.findOne({ where: { email } });
      if (candidate) return res.status(400).json({ message: "User already exists" });

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({ email, password: hashPassword });
      
      const token = generateJwt(user.id, user.email);
      return res.json({ token });
    } catch (e) {
      res.status(500).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User is not found" });

      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) return res.status(400).json({ message: "Wrong password" });

      const token = generateJwt(user.id, user.email);
      return res.json({ token });
    } catch (e) {
      res.status(500).json({ message: "Login error" });
    }
  }

  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email);
    return res.json({ token });
  }
}

module.exports = new AuthController();