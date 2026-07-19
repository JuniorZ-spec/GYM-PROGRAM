import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { generateTrainingPlan } from '../lib/ai';

export const planRouter = Router();

planRouter.post('/generate', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const profile = await prisma.userProfile.findUnique({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        const latestPlan = await prisma.trainingPlan.findFirst({
            where: { userId },
            orderBy: { version: 'desc' },
            select: { version: true },
        });

        const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

        const generated = await generateTrainingPlan(profile);
        const planText = JSON.stringify(generated);

        const newPlan = await prisma.trainingPlan.create({
            data: {
                userId,
                planJson: generated as any,
                planText,
                version: nextVersion,
            },
        });

        res.json({
            id: newPlan.id,
            userId: newPlan.userId,
            version: newPlan.version,
            createdAt: newPlan.createdAt,
            ...generated,
        });
    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ error: 'Failed to generate training plan' });
    }
});

planRouter.get('/current', async (req, res) => {
    try {
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const latestPlan = await prisma.trainingPlan.findFirst({
            where: { userId },
            orderBy: { version: 'desc' },
        });

        if (!latestPlan) {
            return res.status(404).json({ error: 'No training plan found' });
        }

        res.json({
            id: latestPlan.id,
            userId: latestPlan.userId,
            version: latestPlan.version,
            createdAt: latestPlan.createdAt,
            ...(latestPlan.planJson as object),
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
