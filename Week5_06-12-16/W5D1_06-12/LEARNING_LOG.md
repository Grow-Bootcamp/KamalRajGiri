# Learning Log - Week 4, Day 3

**Date:** 28 September 2026  
**Topics:** CRON jobs, scheduled backend tasks, and Mongoose population

## Objectives

- Understand how CRON expressions describe recurring schedules.
- Register a scheduled task with `node-cron`.
- Understand the difference between a scheduler and the application logic it triggers.
- Model a reference from `Student` to `Course` with Mongoose.
- Retrieve referenced course documents with `populate()`.
- Separate models, repositories, services, and scheduled jobs in a TypeScript backend.

## 1. CRON Jobs

A CRON job is a task that runs automatically at a configured time or interval. Common backend uses include daily reports, digest emails, cleanup of expired sessions, and synchronization with external services.

The important separation is:

```text
Scheduler = when the task runs
Function  = what the task does
```

`node-cron` is useful when the schedule is calendar-based. A simple `setInterval()` is suitable for a repeated delay, but it does not express schedules such as “every day at midnight” as clearly.

## 2. CRON Expression Syntax

The standard CRON expression has five fields, read from left to right:

```text
* * * * *
| | | | |
| | | | +-- Day of week (0-6)
| | | +---- Month (1-12)
| | +------ Day of month (1-31)
| +-------- Hour (0-23)
+---------- Minute (0-59)
```

Examples:

| Expression | Meaning |
| --- | --- |
| `* * * * *` | Every minute |
| `0 * * * *` | At minute 0 of every hour |
| `0 0 * * *` | Every day at midnight |
| `0 0 1 * *` | The first day of every month at midnight |
| `*/15 * * * *` | Every 15 minutes |
| `0 0 * * 0` | Every Sunday at midnight |

Some application schedulers, including `node-cron`, support a sixth field for seconds:

```text
*/10 * * * * *
```

In this project, that expression runs the report every 10 seconds so the behavior can be observed during development. A production daily report would use a calendar-based schedule instead.

The exact number and order of fields depends on the scheduler, so its documentation should always be checked. CRON itself does not perform database work; it only invokes the callback when the schedule matches.

## 3. CRON Job Lifecycle

An in-process scheduler follows this lifecycle:

```text
Node application starts
          |
Scheduled job is registered
          |
Node process remains running
          |
Clock is checked continuously
          |
Schedule matches
          |
Callback executes
```

The process must remain running for an in-process job to execute. If the application stops, its scheduler stops too. Production systems may use a worker, queue, operating-system CRON, or a cloud scheduler when stronger reliability or independent execution is required.

## 4. Mongoose Population

The demo has two collections:

```text
Course
  _id
  name
  code
  duration

Student
  _id
  name
  age
  email
  course -> Course ObjectId
```

The `Student` schema stores a reference instead of copying the complete course object into every student document:

```ts
course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
}
```

This avoids duplicating course data. When an API or report needs course details, Mongoose can resolve the reference during a query:

```ts
const students = await Student.find().populate('course');
```

The result contains the student fields and the related `Course` document in place of the course ObjectId.

## 5. Referencing vs Population

These are related but different concepts:

| Concept | Responsibility |
| --- | --- |
| Referencing | Defines the relationship and stores the related document's ObjectId. |
| Population | Resolves that ObjectId and retrieves the related Mongoose document during a query. |

Mongoose `populate()` is a Mongoose-level reference-resolution feature. It is not the same as a SQL `JOIN` or MongoDB's aggregation `$lookup` stage.

Specific fields can be selected when the full related document is unnecessary:

```ts
const students = await Student.find().populate('course', 'name');
```

Multiple references can be populated by defining multiple ObjectId fields with different `ref` values, such as `course` and `department`.

## 6. Demo Application Structure

The `CRON-Populate-demo` project separates responsibilities into layers:

- **Models:** `Student` validates student data and references `Course`; `Course` stores course details.
- **Repository:** `StudentRepository` contains queries such as `getStudentsWithCourse()` and calls `.populate('course')`.
- **Service:** `StudentService` exposes `getAllStudentsWithCourse()` without placing database query details in the controller or job.
- **Scheduled job:** `daily-report.job.ts` queries students with populated courses and prints a report.
- **Server:** `server.ts` loads environment variables, connects to MongoDB, and imports the job so it is registered when the server starts.
- **Practice script:** `test-populate.ts` creates a course and student, then reads students with the course populated.

The repository method is concise because population belongs to the query that needs the related data:

```ts
async getStudentsWithCourse(students: object) {
    return await Student.find(students).populate('course');
}
```

The scheduled report uses the same idea directly:

```ts
const students = await Student.find().populate('course');
```

## 7. Key Takeaways

1. A scheduler controls when work runs; the callback contains what the work does.
2. In-process CRON jobs require the Node.js process to stay alive.
3. Five-field and six-field CRON formats are both used, but their support depends on the scheduler.
4. References prevent duplicated related data by storing an ObjectId.
5. `populate()` retrieves referenced documents at query time; it does not change the stored reference into embedded data.
6. Population can be limited to selected fields when a response does not need every related property.
7. Keeping population queries in a repository and business coordination in a service improves separation of concerns.

## Practice Verification

- [x] Document standard CRON fields and common expressions.
- [x] Register a recurring task with `node-cron`.
- [x] Define `Student.course` as a required reference to `Course`.
- [x] Create a repository query using `.populate('course')`.
- [x] Expose the populated query through `StudentService`.
- [x] Add a scheduled report that reads students with their course details.
- [ ] Run the TypeScript demo against a configured MongoDB instance.
- [ ] Confirm the scheduled report output at runtime.
- [ ] Commit the work and raise the day's pull request.

## Reflection

The main lesson was that scheduling and data relationships solve different problems. `node-cron` decides when a report should run, while Mongoose population makes the report useful by resolving each student's course reference. Keeping those responsibilities separate makes the demo easier to understand, test, and extend.

## Follow-up Actions

- Run `npm run build` in `CRON-Populate-demo`.
- Start the server with a valid `MONGO_URI` and observe the report job.
- Run `test-populate.ts` and verify that the returned student contains the course document.
- Share the learning-log link and pull-request link in the required Zoho and Microsoft Teams comments.