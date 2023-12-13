/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */

/**
 * Represents a university class as returned by the API.
 * Includes details such as class ID, title, description, meeting times and location, status, and semester.
 */
 export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}

/**
 * Represents a student as returned by the API.
 * Includes details such as date of enrollment, name, status, and university ID.
 */
export interface IStudent {
  dateEnrolled: string;
  name: string;
  status: string;
  universityId: string;
}

/**
 * Enum representing different statuses of a student.
 * Includes ENROLLED, GRADUATED, and UNENROLLED as possible statuses.
 */
export enum StudentStatus {
  ENROLLED = "enrolled",
  GRADUATED = "graduated",
  UNENROLLED = "unenrolled"
}

/**
 * Type representing a student's final grade in a class.
 * Includes the class information, student information, and the final numerical grade.
 */
export type StudentFinalGrade = {
  class: IUniversityClass;
  student: IStudent;
  finalGrade: number;
};

/**
 * Represents an assignment as returned by the API.
 * Includes details such as assignment ID, associated class ID, date, and weight of the assignment.
 */
export interface IAssignment {
  assignmentId: string;
  classId: string;
  date: string;
  weight: number;
}

/**
 * Represents the grades of a student for a class as returned by the API.
 * Includes class ID, a record of grades (where keys are assignment IDs and values are numerical grades),
 * student name, and student ID.
 */
export interface IGrades {
  classId: string;
  grades: Record<string, number>;
  name: string;
  studentId: string;
}
