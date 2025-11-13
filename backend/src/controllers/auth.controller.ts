import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result
    });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json({
      status: 'success',
      data: result
    });
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({
      status: 'success',
      data: result
    });
  },

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  },

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.json({
      status: 'success',
      data: result
    });
  },

  async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.json({
      status: 'success',
      data: result
    });
  },

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.json({
      status: 'success',
      data: result
    });
  }
};
