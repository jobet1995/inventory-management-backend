import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as authValidator from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(authValidator.registerSchema), authController.register);
router.post('/signup', validate(authValidator.registerSchema), authController.register);
router.get('/login', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'To log in, please send a POST request to this endpoint with your email and password body.' 
  });
});

router.post('/login', validate(authValidator.loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
