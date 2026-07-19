import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const progressRouter = Router();

progressRouter.post('/weight', async (req, res) => {
    try {
        const { userId, weight } = req.body;

        if (!userId || weight == null) {
            return res.status(400).json({ error: 'userId and weight are required' });
        }

        const log = await prisma.weightLog.create({
            data: { userId, weight: Number(weight) },
        });

        res.json(log);
    } catch (error) {
        console.error('Error logging weight:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

progressRouter.get('/weight/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await prisma.weightLog.findMany({
            where: { userId },
            orderBy: { loggedAt: 'asc' },
        });

        res.json(logs);
    } catch (error) {
        console.error('Error fetching weight history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

progressRouter.post('/session', async (req, res) => {
    try {
        const { userId, week, day } = req.body;

        if (!userId || week == null || !day) {
            return res.status(400).json({ error: 'userId, week and day are required' });
        }

        const log = await prisma.sessionLog.create({
            data: { userId, week: Number(week), day },
        });

        res.json(log);
    } catch (error) {
        console.error('Error logging session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

progressRouter.get('/sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await prisma.sessionLog.findMany({
            where: { userId },
            orderBy: { completedAt: 'desc' },
        });

        res.json(logs);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
