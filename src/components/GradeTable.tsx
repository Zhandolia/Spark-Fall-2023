import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LinearProgress } from "@mui/material";
import { calcAllFinalGrade } from "../utils/calculate_grade";

// Generates mock data for testing the GradeTable component.
export function dummyData() {
  return [];
}

/**
 * This is the component where you should write the code for displaying the
 * the table of grades.
 *
 * You might need to change the signature of this function.
 *
 */

// Types for the properties passed to the GradeTable component.
interface GradeTableProps {
  currClassId: string;
}

// Defines the structure for final grade data in the table.
interface FinalGrade {
  id: number;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  semester: string;
  finalGrade: number;
}

// Column definitions for the data grid displaying final grades.
const columns: GridColDef[] = [
  { field: "studentId", headerName: "Student ID", width: 150 },
  { field: "studentName", headerName: "Student Name", width: 200 },
  { field: "classId", headerName: "Class ID", width: 150},
  { field: "className", headerName: "Class Name", width: 200 },
  { field: "semester", headerName: "Semester", width: 150 },
  { field: "finalGrade", headerName: "Final Grade", width: 150 },
];

// Component for displaying grade data in a table format.
export const GradeTable: React.FC<GradeTableProps> = ({ currClassId }) => {
  const [rows, setRows] = useState<FinalGrade[]>([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    setLoading(true);
    if (currClassId) {
      calcAllFinalGrade(currClassId)
        .then((finalGrades) => {
          const gridRows = finalGrades.map((finalGrade, index) => ({
            id: index + 1,
            studentId: finalGrade.studentId,
            studentName: finalGrade.studentName,
            classId: finalGrade.classDetails.classId,
            className: finalGrade.classDetails.title,
            semester: finalGrade.classDetails.semester,
            finalGrade: finalGrade.finalGrade
          }));
  
          setRows(gridRows);
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      setRows([]);
      setLoading(false); 
    }
  }, [currClassId]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      {loading ? (
        <LinearProgress color="secondary" />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection={false}
        />
      )}
    </div>
  );
};