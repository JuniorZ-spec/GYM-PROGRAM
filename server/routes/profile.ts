import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const profileRouter = Router();

profileRouter.post('/', async (req, res) => {
    try {
        const { userId, ...profileData } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const {
            goal,
            currentWeight,
            targetWeight,
            height,
            age,
            gender,
            level,
            daysPerWeek,
            location,
            equipment,
            injuries,
        } = profileData;

        if (
            !goal ||
            currentWeight == null ||
            targetWeight == null ||
            height == null ||
            age == null ||
            !gender ||
            !level ||
            daysPerWeek == null ||
            !location
        ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const data = {
            goal,
            currentWeight: Number(currentWeight),
            targetWeight: Number(targetWeight),
            height: Number(height),
            age: Number(age),
            gender,
            level,
            daysPerWeek: Number(daysPerWeek),
            location,
            equipment: Array.isArray(equipment) ? equipment : [],
            injuries: injuries || null,
        };

        await prisma.userProfile.upsert({
            where: { userId },
            update: data,
            create: { userId, ...data },
        });

        res.json({ message: 'Profile saved successfully!' });
    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

profileRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await prisma.userProfile.findUnique({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
