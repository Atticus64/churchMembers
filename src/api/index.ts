import { Router } from 'express';
import { membersRouter } from './members.js';

const api = Router();

api.get('/', async (req, res) => {
    res.send('api route');
});

// Mount members router
api.use('/members', membersRouter);

export {
    api
};

