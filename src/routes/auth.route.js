import express from 'express';
import { signup } from '#controllers';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  res.status(200).send('Sign in Route:: Not Implemented');
});

router.post('/sign-out', (req, res) => {
  res.status(200).send('Sign out Route:: Not Implemented');
});

export default router;
