import { AppError } from './app-error.js';
export async function getStudents(){

    // throw new Error('Failed to get students data');
    throw new AppError('Student data not found', 404);
}