/**
 * This file contains function stubs (incomplete functions) that 
 * you must use to begin the work for calculating the grades. 
 * 
 * You may need more functions than are currently here...we highly encourage you to define more.
 * 
 * Anything that has a type of "undefined" you will need to replace with something.
 */

 import { IUniversityClass, IStudent, IGrades, IAssignment } from "../types/api_types";
 import { MY_BU_ID, BASE_API_URL, GET_DEFAULT_HEADERS } from "../globals";

 /**
 * Fetches a list of assignments for a given class.
 * 
 * @param classID The ID of the class for which assignments are to be fetched.
 * @returns A promise that resolves to an array of IAssignment objects.
 */
 
 async function fetchAssignments(classID: string): Promise<IAssignment[]> {
   const url = `${BASE_API_URL}/class/listAssignments/${classID}?buid=${MY_BU_ID}`;
 
   try {
     const response = await fetch(url, {
       method: "GET",
       headers: GET_DEFAULT_HEADERS(),
     });
     if (!response.ok) {
       throw new Error(`Error fetching assignments ${classID}`);
     }
     return await response.json();
   } catch (error) {
     console.error(error);
     throw error;
   }
 }
 
/**
 * Fetches the grades for a given student in a specific class.
 * 
 * @param studentID The ID of the student whose grades are to be fetched.
 * @param classID The ID of the class for which grades are to be fetched.
 * @returns A promise that resolves to an IGrades object containing the student's grades.
 */

 async function fetchGrades(studentID: string, classID: string): Promise<IGrades> {
   const url = `${BASE_API_URL}/student/listGrades/${studentID}/${classID}/?buid=${MY_BU_ID}`;
 
   try {
     const response = await fetch(url, {
       method: "GET",
       headers: GET_DEFAULT_HEADERS(),
     });
     if (!response.ok) {
       throw new Error(`Error fetching grades ${studentID} in class ${classID}`);
     }
     return await response.json();
   } catch (error) {
     console.error(error);
     throw error;
   }
 }
 
 /**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */

 export async function calculateStudentFinalGrade(studentID: string, classID: string): Promise<number> {
   try {
     const assignments = await fetchAssignments(classID);
     const studentGrades = await fetchGrades(studentID, classID);
 
     let totalWeightedScore = 0;
     let totalWeight = 0;
 
     const studentGrade = studentGrades.grades[0];
 
     for (let assignment of assignments) {
       const assignmentID = assignment.assignmentId;
 
       if (typeof studentGrade === 'object' && assignmentID in studentGrade) {
         const assignmentGrade = Number(studentGrade[assignmentID as keyof typeof studentGrade]);
         const assignmentWeight = assignment.weight;
 
         totalWeightedScore += assignmentGrade * assignmentWeight;
         totalWeight += assignmentWeight;
       }
     }
 
     return totalWeight === 0 ? 0 : totalWeightedScore / totalWeight;
   } catch (error) {
     console.error(error);
     throw error;
   }
 }

 /**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
 
 export async function calcAllFinalGrade(classID: string): Promise<{ classDetails: IUniversityClass; studentName: string; studentId: string; finalGrade: number }[]> {
   try {
     const studentsResponse = await fetch(`${BASE_API_URL}/class/listStudents/${classID}?buid=${MY_BU_ID}`, { headers: GET_DEFAULT_HEADERS() });
     if (!studentsResponse.ok) {
       throw new Error(`Error fetching students for class ${classID}`);
     }
     const studentIDs: string[] = await studentsResponse.json();
 
     const classResponse = await fetch(`${BASE_API_URL}/class/GetById/${classID}?buid=${MY_BU_ID}`, { headers: GET_DEFAULT_HEADERS() });
     if (!classResponse.ok) {
       throw new Error(`Error fetching class ${classID}`);
     }
     const classDetails: IUniversityClass = await classResponse.json();
 
     const finalGrades = await Promise.all(
       studentIDs.map(async (studentID) => {
         const finalGrade = await calculateStudentFinalGrade(studentID, classID);
         const studentResponse = await fetch(`${BASE_API_URL}/student/GetById/${studentID}?buid=${MY_BU_ID}`, { headers: GET_DEFAULT_HEADERS() });
         if (!studentResponse.ok) {
           throw new Error(`Error fetching student ${studentID}`);
         }
         const student: IStudent[] = await studentResponse.json();
         const studentName: string = student[0].name;
 
         return { classDetails, studentName, studentId: studentID, finalGrade };
       })
     );
 
     return finalGrades;
   } catch (error) {
     console.error(error);
     throw error;
   }
 }
 