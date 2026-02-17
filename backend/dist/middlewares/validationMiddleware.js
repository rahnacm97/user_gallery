import { ZodError } from 'zod';
import { HttpStatus } from '../shared/constants/httpStatus';
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Validation failed',
                errors: error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            });
            return;
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
