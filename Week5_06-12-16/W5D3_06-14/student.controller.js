import { getStudents as getStudentsService } from './student.service.js';

// export async function getStudents(req, res, next){
//     const students = await getStudentsService();
//     res.json(students);
// }
export async function getStudents(req, res, next){
    try{
        const students = await getStudentsService();
        res.json(students);
    } catch(error){
        console.log("Controller caught the error");
        next(error);
    }
}