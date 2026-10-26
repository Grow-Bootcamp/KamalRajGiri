# Learning Log - Week 4, Day 4

**Date:** 29 September 2026  
**Topics:** MongoDB filtering, sorting, pagination, aggregation pipelines, and Mongoose virtual properties

## Objectives

- Filter documents with comparison, logical, and regular-expression operators.
- Sort query results using one or more fields.
- Implement page-based pagination and return pagination metadata.
- Use aggregation stages to filter, group, calculate, sort, and reshape data.
- Join related collections with `$lookup` and expand arrays with `$unwind`.
- Define schema virtuals and virtual population in Mongoose.

## 1. Advanced Filtering

Filtering returns only documents that satisfy a condition. This is important when a collection contains many documents and the API should return only the relevant subset.

### Comparison Operators

| Operator | Meaning |
| --- | --- |
| `$gt` | Greater than |
| `$gte` | Greater than or equal to |
| `$lt` | Less than |
| `$lte` | Less than or equal to |
| `$eq` | Equal to |
| `$ne` | Not equal to |
| `$in` | Matches one of the supplied values |
| `$nin` | Does not match any supplied value |

Example: find students aged from 20 through 30 who study one of two courses:

```js
Student.find({
    age: { $gte: 20, $lte: 30 },
    course: { $in: ['Computer Engineering', 'Computer Science'] },
});
```

Logical operators combine conditions:

- `$and` requires every condition to be true.
- `$or` requires at least one condition to be true.
- `$not` negates a condition.
- `$nor` requires none of the listed conditions to be true.

## 2. Regular-Expression Search

An exact equality condition does not find partial matches. `$regex` supports pattern-based searches, and `$options: 'i'` makes the search case-insensitive:

```js
Student.find({
    name: {
        $regex: 'kam',
        $options: 'i',
    },
});
```

Useful pattern characters include `^` for the beginning of a string, `$` for the end, `.` for one character, `+` for one or more repetitions, `*` for zero or more repetitions, and `|` for alternatives. Regex input should be validated or escaped when it comes directly from a user so that the search behaves predictably and does not create an unnecessarily expensive pattern.

## 3. Sorting

MongoDB sort directions are represented by numbers:

```js
1  // ascending
-1 // descending
```

Multiple fields can be sorted in one query. In the demo, students are sorted by semester ascending and then age descending:

```js
Student.find({}).sort({
    semester: 1,
    age: -1,
});
```

The second field acts as a tie-breaker when documents have the same value for the first field.

## 4. Pagination

Pagination divides a large result set into smaller pages. The number of documents to skip is calculated as:

```text
skip = (page - 1) * limit
```

For page 3 with a limit of 10, the query skips 20 documents and returns the next 10.

```js
const students = await Student.find(filter)
    .sort({ semester: 1, age: -1 })
    .skip(skip)
    .limit(limit);

const total = await Student.countDocuments(filter);
const totalPages = Math.ceil(total / limit);
```

The service validates that `page` and `limit` are greater than zero, then returns both the data and metadata:

```js
{
    students: [...],
    pagination: {
        page,
        limit,
        total,
        totalPages,
        skip,
    },
}
```

Counting with the same filter is necessary for an accurate `totalPages` value.

## 5. Aggregation Pipelines

A normal query mainly asks which documents match. An aggregation pipeline can filter, combine, calculate, summarize, and reshape documents through a sequence of stages. The output of one stage becomes the input to the next stage.

### Common Stages

| Stage | Purpose |
| --- | --- |
| `$match` | Filters documents within the pipeline. |
| `$group` | Combines documents by a grouping key and calculates values. |
| `$sum` | Counts documents or adds numeric values. |
| `$avg` | Calculates an average. |
| `$min` / `$max` | Finds the smallest or largest value. |
| `$sort` | Orders pipeline results. |
| `$project` | Selects, renames, calculates, or reshapes output fields. |
| `$unwind` | Converts each array element into its own document. |
| `$lookup` | Combines documents from a related collection. |

### Group Students by Semester

The demo groups students by semester, sorts the groups, and renames the group key in the response:

```js
Student.aggregate([
    {
        $group: {
            _id: '$semester',
            studentCount: { $sum: 1 },
        },
    },
    { $sort: { _id: 1 } },
    {
        $project: {
            _id: 0,
            semester: '$_id',
            studentCount: 1,
        },
    },
]);
```

### Filter, Calculate, and Sort

The advanced pipeline first keeps students aged 21 or older, then groups them by semester and calculates the count, average age, minimum age, and maximum age:

```js
[
    { $match: { age: { $gte: 21 } } },
    {
        $group: {
            _id: '$semester',
            studentCount: { $sum: 1 },
            averageAge: { $avg: '$age' },
            minimumAge: { $min: '$age' },
            maximumAge: { $max: '$age' },
        },
    },
    { $sort: { studentCount: -1 } },
    {
        $project: {
            _id: 0,
            semester: '$_id',
            studentCount: 1,
            averageAge: 1,
            minimumAge: 1,
            maximumAge: 1,
        },
    },
]
```

The order of stages matters. Filtering earlier reduces the number of documents subsequent stages must process.

## 6. `$lookup` and `$unwind`

Students store an array of course ObjectIds. The course aggregation uses `$lookup` to retrieve matching course documents:

```js
{
    $lookup: {
        from: 'courses',
        localField: 'courses',
        foreignField: '_id',
        as: 'courseDetails',
    },
}
```

`$lookup` produces an array in `courseDetails`. `$unwind: '$courseDetails'` turns each course in that array into a separate pipeline document. This makes it possible to project student and course fields together or group students by course.

The course-count pipeline follows this sequence:

```text
$lookup students with courses
        |
$unwind one document per course
        |
$group by course name
        |
$sort highest count first
        |
$project a clean course/count response
```

## 7. Mongoose Virtual Properties

A virtual property is calculated from existing document data and is not stored in MongoDB. The student schema defines `academicLevel` from `semester`:

```js
StudentSchema.virtual('academicLevel').get(function () {
    if (this.semester <= 2) return 'Beginner';
    if (this.semester <= 4) return 'Intermediate';
    if (this.semester <= 6) return 'Advanced';
    return 'Final Year';
});
```

The schema enables virtuals in JSON and object output:

```js
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
```

This allows API responses to include the calculated property without duplicating derived data in the database.

## 8. Virtual Population

The course schema defines a reverse relationship to students:

```js
CourseSchema.virtual('students', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'courses',
});
```

The repository can then populate students from a course:

```js
Course.find().populate('students');
```

This is useful when the stored relationship exists on the student documents but a response needs to start from the course and list its students.

## 9. Demo Application Structure

- **Models:** Define student fields, course references, the `academicLevel` virtual, and the reverse `students` virtual.
- **Repositories:** Encapsulate filtering, sorting, pagination, population, counting, and aggregation queries.
- **Service:** Calculates pagination offsets and metadata, validates page inputs, and delegates database operations.
- **Application:** Exposes examples for filtering, regex search, sorting, pagination, population, and aggregation.
- **Seed script:** Clears old sample data and creates three courses and six students with real course ObjectIds.
- **Server:** Loads environment variables, connects to MongoDB, and starts Express.

## Key Takeaways

1. Filtering reduces the documents returned by a query; aggregation can also filter as one stage in a larger transformation.
2. Sort direction is `1` for ascending and `-1` for descending, and multiple fields provide deterministic tie-breaking.
3. Pagination requires both `skip`/`limit` and a count query to produce useful page metadata.
4. Aggregation pipelines transform documents stage by stage, so stage order affects both results and efficiency.
5. `$lookup` combines related collections, while `$unwind` expands array elements into separate pipeline documents.
6. Virtual properties calculate derived values without storing duplicate data.
7. Virtual population supports reverse lookups such as finding all students associated with a course.

## Practice Verification

- [x] Add comparison and regex filtering examples.
- [x] Add single-field and multi-field sorting examples.
- [x] Implement page and limit validation with calculated skip values.
- [x] Return total records and total pages with paginated results.
- [x] Build semester grouping and advanced statistics pipelines.
- [x] Use `$lookup`, `$unwind`, `$group`, and `$project` for course reports.
- [x] Define and expose the `academicLevel` virtual.
- [x] Define and use virtual population from course to students.
- [ ] Run the seed script against the configured MongoDB instance.
- [ ] Exercise the API routes and verify aggregation results at runtime.
- [ ] Commit the learning log and raise the day's pull request.

## Reflection

The main lesson was that advanced queries are a combination of careful input handling and deliberate data shaping. Basic filters and pagination support everyday API reads, while aggregation pipelines answer reporting questions such as student counts and average ages. Virtual properties and virtual population add useful response data without storing values that can be derived from the existing relationship.

## Follow-up Actions

- Run `npm run build` in `aggregation-demo`.
- Run `npm run seed` with a valid `MONGO_URI`.
- Test filtering, sorting, pagination, population, and aggregation endpoints.
- Share the learning-log link and pull-request link in the required Zoho and Microsoft Teams comments.