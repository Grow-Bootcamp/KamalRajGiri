import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import studentService from "./services/student.service.js";
import courseRepository from "./repos/course.repo.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ======================================================
// HOME
// ======================================================

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Aggregation Demo API!",
  });
});

// ======================================================
// FILTERING
// ======================================================

app.get("/students/filter", async (req: Request, res: Response) => {
  try {
    const students = await studentService.getStudents({
      age: {
        $gte: 21,
      },
    });

    res.status(200).json({
      status: "success",
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to filter students",
    });
  }
});

// ======================================================
// REGEX SEARCH
// ======================================================

app.get("/students/search", async (req: Request, res: Response) => {
  try {
    const name = String(req.query.name || "");

    const students = await studentService.getStudents({
      name: {
        $regex: name,
        $options: "i",
      },
    });

    res.status(200).json({
      status: "success",
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to search students",
    });
  }
});

// ======================================================
// SORTING
// ======================================================

app.get("/students/sorted", async (req: Request, res: Response) => {
  try {
    const students = await studentService.getSortedStudents(
      {},
      {
        semester: 1,
        age: -1,
      }
    );

    res.status(200).json({
      status: "success",
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to sort students",
    });
  }
});

// ======================================================
// PAGINATION
// ======================================================

app.get("/students", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const result = await studentService.getPaginatedStudents(
      {},
      page,
      limit,
      {
        semester: 1,
        age: -1,
      }
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get students",
    });
  }
});

// ======================================================
// POPULATE COURSES
// ======================================================

app.get(
  "/students/with-courses",
  async (req: Request, res: Response) => {
    try {
      const students =
        await studentService.getStudentsWithCourses();

      res.status(200).json({
        status: "success",
        count: students.length,
        data: students,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to populate courses",
      });
    }
  }
);

// ======================================================
// GET ONE STUDENT WITH COURSES
// ======================================================

app.get(
  "/students/:id/with-courses",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // TypeScript safety check
      if (!id || Array.isArray(id)) {
        res.status(400).json({
          status: "error",
          message: "Invalid student ID",
        });
        return;
      }

      const student =
        await studentService.getStudentWithCourses(id);

      if (!student) {
        res.status(404).json({
          status: "error",
          message: "Student not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: student,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to get student",
      });
    }
  }
);

// ======================================================
// AGGREGATION: STUDENTS BY SEMESTER
// ======================================================

app.get(
  "/students/aggregation/semester",
  async (req: Request, res: Response) => {
    try {
      const result =
        await studentService.aggregateStudents([
          {
            $group: {
              _id: "$semester",
              studentCount: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              _id: 1,
            },
          },

          {
            $project: {
              _id: 0,
              semester: "$_id",
              studentCount: 1,
            },
          },
        ]);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Aggregation failed",
      });
    }
  }
);

// ======================================================
// ADVANCED AGGREGATION
// ======================================================

app.get(
  "/students/aggregation/advanced",
  async (req: Request, res: Response) => {
    try {
      const result =
        await studentService.aggregateStudents([
          // 1. Filter
          {
            $match: {
              age: {
                $gte: 21,
              },
            },
          },

          // 2. Group
          {
            $group: {
              _id: "$semester",

              studentCount: {
                $sum: 1,
              },

              averageAge: {
                $avg: "$age",
              },

              minimumAge: {
                $min: "$age",
              },

              maximumAge: {
                $max: "$age",
              },
            },
          },

          // 3. Sort
          {
            $sort: {
              studentCount: -1,
            },
          },

          // 4. Reshape output
          {
            $project: {
              _id: 0,
              semester: "$_id",
              studentCount: 1,
              averageAge: 1,
              minimumAge: 1,
              maximumAge: 1,
            },
          },
        ]);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Advanced aggregation failed",
      });
    }
  }
);

// ======================================================
// AGGREGATION + LOOKUP + UNWIND
// ======================================================

app.get(
  "/students/aggregation/courses",
  async (req: Request, res: Response) => {
    try {
      const result =
        await studentService.aggregateStudents([
          // 1. Join Student with Course
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courseDetails",
            },
          },

          // 2. Convert courseDetails array
          // into individual documents
          {
            $unwind: "$courseDetails",
          },

          // 3. Select required fields
          {
            $project: {
              _id: 0,
              name: 1,
              age: 1,
              semester: 1,
              email: 1,

              course: "$courseDetails.name",
              department: "$courseDetails.department",
            },
          },
        ]);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Course aggregation failed",
      });
    }
  }
);

// ======================================================
// COUNT STUDENTS BY COURSE
// ======================================================

app.get(
  "/students/aggregation/course-count",
  async (req: Request, res: Response) => {
    try {
      const result =
        await studentService.aggregateStudents([
          // 1. Join Student and Course
          {
            $lookup: {
              from: "courses",
              localField: "courses",
              foreignField: "_id",
              as: "courseDetails",
            },
          },

          // 2. One document per course
          {
            $unwind: "$courseDetails",
          },

          // 3. Group by course
          {
            $group: {
              _id: "$courseDetails.name",

              studentCount: {
                $sum: 1,
              },
            },
          },

          // 4. Highest count first
          {
            $sort: {
              studentCount: -1,
            },
          },

          // 5. Rename _id to course
          {
            $project: {
              _id: 0,
              course: "$_id",
              studentCount: 1,
            },
          },
        ]);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Course count aggregation failed",
      });
    }
  }
);

// ======================================================
// VIRTUAL POPULATE: COURSE → STUDENTS
// ======================================================

app.get(
  "/courses/with-students",
  async (req: Request, res: Response) => {
    try {
      const courses =
        await courseRepository.getCoursesWithStudents();

      res.status(200).json({
        status: "success",
        count: courses.length,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to populate students",
      });
    }
  }
);

export default app;