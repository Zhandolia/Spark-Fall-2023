import { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Importing Grid for layout
import { Select, Typography, MenuItem } from "@mui/material"; // Importing UI components from MUI
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID } from "./globals"; // Importing global constants
import { IUniversityClass } from "./types/api_types"; // Importing type definitions
import { GradeTable } from "./components/GradeTable"; // Importing the GradeTable component

function App() {
  const [currClassId, setCurrClassId] = useState<string>(""); // State for current class ID
  const [classList, setClassList] = useState<IUniversityClass[]>([]); // State for list of classes
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator

  const fetchClassList = async () => { // Function to fetch the list of classes
    setIsLoading(true); // Setting loading state
    try {
      const headers = GET_DEFAULT_HEADERS(); // Getting default headers for API call
      const response = await fetch( // Making API call to fetch class list
        `${BASE_API_URL}/class/listBySemester/spring2023?buid=${MY_BU_ID}`, 
        { headers }
      );
      if (response.ok) {
        const data = await response.json(); // Parsing JSON response
        setClassList(data); // Setting class list state
      } else {
        console.error("Failed to fetch class list.");
      }
    } catch (error) {
      console.error("Error fetching class list:", error);
    } finally {
      setIsLoading(false); // Resetting loading state
    }
  };

  useEffect(() => {
    fetchClassList(); // Fetching class list on component mount
  }, []);

  const fetchAssignmentsForClass = async (classID: string) => { // Function to fetch assignments for a class
    const url = `${BASE_API_URL}/class/listAssignments/${classID}?buid=${MY_BU_ID}`;
    const headers = GET_DEFAULT_HEADERS();
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Error fetching assignments for class ${classID}`);
      }
      const assignments = await response.json(); // Parsing JSON response
      return assignments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => { // Fetching assignments when current class ID changes
      setIsLoading(true);
      try {
        if (currClassId) {
          const assignments = await fetchAssignmentsForClass(currClassId);
          console.log(assignments); 
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currClassId) {
      fetchAssignments();
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
          <div style={{ width: '100%' }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Select
                fullWidth={true}
                label="Class"
                value={currClassId}
                onChange={(event) => setCurrClassId(event.target.value as string)}
              >
                <MenuItem value="">Select a Class</MenuItem>
                {classList.map((classItem) => (
                  <MenuItem key={classItem.classId} value={classItem.classId}>
                    {classItem.title}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <GradeTable currClassId={currClassId} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
