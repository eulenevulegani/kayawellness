import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors.js';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');
    throw new ValidationError(messages);
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const sessionValidation = [
  body('activityType').isIn(['MEDITATION', 'BREATHWORK', 'SOUNDSCAPE', 'SLEEP_STORY', 'AFFIRMATION'])
    .withMessage('Invalid activity type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be positive'),
  validate
];

export const journalValidation = [
  body('content').notEmpty().withMessage('Content is required'),
  validate
];
