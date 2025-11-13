import { Router } from 'express';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { category, limit = '20', offset = '0' } = req.query as any;
  const where: any = {};
  
  if (category) {
    where.category = category;
  }

  const posts = await prisma.communityPost.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, profilePicture: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
    skip: parseInt(offset)
  });

  res.json({ status: 'success', data: posts });
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const post = await prisma.communityPost.create({
    data: {
      userId: req.user!.id,
      ...req.body
    },
    include: {
      user: {
        select: { id: true, name: true, profilePicture: true }
      }
    }
  });
  res.status(201).json({ status: 'success', data: post });
});

router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  const like = await prisma.postLike.create({
    data: {
      userId: req.user!.id,
      postId: req.params.id
    }
  });
  res.status(201).json({ status: 'success', data: like });
});

router.delete('/:id/unlike', authenticate, async (req: AuthRequest, res: Response) => {
  await prisma.postLike.deleteMany({
    where: {
      userId: req.user!.id,
      postId: req.params.id
    }
  });
  res.json({ status: 'success', message: 'Unliked' });
});

router.get('/:id/comments', async (req: AuthRequest, res: Response) => {
  const comments = await prisma.comment.findMany({
    where: { postId: req.params.id },
    include: {
      user: {
        select: { id: true, name: true, profilePicture: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  res.json({ status: 'success', data: comments });
});

router.post('/:id/comments', authenticate, async (req: AuthRequest, res: Response) => {
  const comment = await prisma.comment.create({
    data: {
      userId: req.user!.id,
      postId: req.params.id,
      ...req.body
    },
    include: {
      user: {
        select: { id: true, name: true, profilePicture: true }
      }
    }
  });
  res.status(201).json({ status: 'success', data: comment });
});

export default router;
