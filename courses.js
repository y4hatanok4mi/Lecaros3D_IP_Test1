const express = require("express");
const mongoose = require("mongoose");
const Course = require("./schema/courseSchema");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("BACKEND API ENDPOINT");
});


// Retrieve all courses and sort them alphabetically by names
app.get("/courses/getSortedCourses", async (req, res) => {
  try {
    // Retrieve all documents from the Course collection
    const years = await Course.find();

    // Initialize an empty array to store courses
    let courses = [];

    // Iterate over each year document
    years.forEach((year) => {
      // Iterate over each key ("1st Year", "2nd Year", etc.) in the year document
      ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
        // Check if the key exists in the year document
        if (year[yearKey]) {
          // Push all courses in the year to the courses array
          courses.push(...year[yearKey]);
        }
      });
    });

    // Sort the courses alphabetically by their description (name)
    courses.sort((a, b) => a.description.localeCompare(b.description));

    // Send the sorted courses
    res.json(courses);
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: err.message });
  }
});



// Select and extract the name and specialization of each course
app.get("/courses/getNameNSpecialization", async (req, res) => {
  try {
    // Retrieve all documents from the Course collection
    const years = await Course.find();
    
    // Initialize an empty array to store courses
    let courses = [];
    
    // Iterate over each year document
    years.forEach((year) => {
      // Iterate over each key ("1st Year", "2nd Year", etc.) in the year document
      ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
        // Check if the key exists in the year document
        if (year[yearKey]) {
          // Push all courses in the year to the courses array
          courses.push(...year[yearKey]);
        }
      });
    });
    
    // Extract only the name and description fields of each course
    const info = courses.map((course) => ({
      code: course.code,
      description: course.description,
    }));
    
    // Send the extracted course information
    res.json(info);
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: err.message });
  }
});


// Retrieve all BSIS and BSIT courses from the curriculum
app.get("/courses/getCourses", async (req, res) => {
  try {
    // Retrieve all documents from the Course collection
    const years = await Course.find();

    let courses = [];

    // Iterate through each year
    years.forEach((year) => {
      // Iterate through each academic year (1st Year, 2nd Year, 3rd Year, 4th Year)
      ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
        // Check if the current year has courses
        if (year[yearKey]) {
          // Add courses of the current year to the 'courses' array
          courses.push(...year[yearKey]);
        }
      });
    });

    // Filter courses by tags (BSIT or BSIS) and map them to include only necessary information
    const info = courses
      .filter(
        (course) => course.tags.includes("BSIT") || course.tags.includes("BSIS")
      )
      .map((course) => ({
        code: course.code,
        description: course.description,
        units: course.units,
        tags: course.tags,
      }));

    // Send the filtered course information
    res.json(info);
  } catch (err) {
    // If an error occurs, send a 500 status response with an error message
    res.status(500).json({ message: err.message });
  }
});


//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/courseInfo")
  .then(() => {
    console.log("Connected to Mongo Database!");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });