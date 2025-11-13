import { Router } from 'express';
import { Response } from 'express';

const router = Router();

// Stripe webhook endpoint (add proper Stripe signature verification)
router.post('/stripe', async (req, res: Response) => {
  // Handle Stripe webhooks
  res.json({ received: true });
});

export default router;
