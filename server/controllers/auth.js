const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/api-error');

const generateJwt = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest("Email and password are required"));
      }

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.badRequest("User with this email already exists"));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({ email, password: hashPassword });
      
      const token = generateJwt(user.id, user.email);
      return res.json({ token });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.notFound("User is not found"));
      }

      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Wrong password"));
      }

      const token = generateJwt(user.id, user.email);
      return res.json({ token });
    } catch (e) {
      next(e);
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.email);
      return res.json({ token });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();