import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface IUniversityClass {
  classId: string;
  className: string;
}

interface IGrade {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  semester: string;
  finalGrade: number;
}

const App = () => {
  const [currClassId, setCurrClassId] = useState('');
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const response = await fetch('https://spark-se-assessment-api.azurewebsites.net/api/classes?BUID=yourBUID', {
          headers: {
            'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
          }
        });
        const data = await response.json();
        setClassList(data);
      } catch (error) {
        console.error('Error fetching class list:', error);
      }
    };

    fetchClassList();
  }, []);

  useEffect(() => {
    if (currClassId) {
      const fetchGrades = async () => {
        try {
          const response = await fetch(`https://spark-se-assessment-api.azurewebsites.net/api/grades?classId=${currClassId}&BUID=yourBUID`, {
            headers: {
              'x-functions-key': '6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ=='
            }
          });
          const data = await response.json();
          setGrades(data);
        } catch (error) {
          console.error('Error fetching grades:', error);
        }
      };

      fetchGrades();
    }
  }, [currClassId]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Grid container spacing={2} style={{ padding: '1rem' }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <Select
            fullWidth
            value={currClassId}
            onChange={(e) => setCurrClassId(e.target.value)}
            label="Class"
          >
            {classList.map((c) => (
              <MenuItem key={c.classId} value={c.classId}>
                {c.className}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Class ID</TableCell>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Final Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.studentId}>
                    <TableCell>{grade.studentId}</TableCell>
                    <TableCell>{grade.studentName}</TableCell>
                    <TableCell>{grade.classId}</TableCell>
                    <TableCell>{grade.className}</TableCell>
                    <TableCell>{grade.semester}</TableCell>
                    <TableCell>{grade.finalGrade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
