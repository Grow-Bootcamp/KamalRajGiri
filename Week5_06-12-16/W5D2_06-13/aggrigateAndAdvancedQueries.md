# Aggrigation & Advanced Queries
“Analyze documents and extract useful information.”


## Filtering
Selecting only documents that satisfy the condition as there may be thouands of data in database.

### MongoDB query operators
*Comparison*
_____________________________________________
| Operator | Meaning                        |
| -------- | ------------------------------ |
| `$gt`    | greater than                   |
| `$gte`   | greater than or equal          |
| `$lt`    | less than                      |
| `$lte`   | less than or equal             |
| `$eq`    | equal                          |
| `$ne`    | not equal                      |
| `$in`    | matches one of supplied values |
| `$nin`   | does not match supplied values |
|___________________________________________|

*Logical Operator*
Sometimes one condition is not enough so we use logical operators.
MOngoDB gives us : `$and`, `$or`, `$not`, `$nor`

`$and` : every condition must be true 
`$or` : Atleast one must be true
`$not` : Neglats a condition
`$nor` : None of the specified condition must be  true

*Regex/text filtering*
normally` name : "ka"` search for exact `name 'ka'` but when we want all names that include 'ka' we use $regex and we use $option as well with it for better optioning.

db.students.find({
  name: {
    $regex: "kam",
    $options: "i"
  }
})

*Regex Symbols / Pattern Types*

| Symbol / Pattern | Name | Purpose | Example Pattern | Meaning |
|---|---|---|---|---|
| `abc` | Literal pattern | Matches specified text | `kam` | Contains `kam` anywhere |
| `^` | Start anchor | Matches beginning of string | `^Kam` | Starts with `Kam` |
| `$` | End anchor | Matches end of string | `Giri$` | Ends with `Giri` |
| `.` | Dot / wildcard | Matches any single character except newline by default | `K.m` | Matches `Kam`, `Kim`, `K9m` |
| `*` | Zero or more | Repeats preceding item zero or more times | `Ka*m` | Matches `Km`, `Kam`, `Kaam` |
| `+` | One or more | Repeats preceding item one or more times | `Ka+m` | Matches `Kam`, `Kaam`, but not `Km` |
| `?` | Optional | Matches preceding item zero or one time | `Kama?` | Matches `Kam` or `Kama` |
| `[abc]` | Character class | Matches any one listed character | `K[ai]m` | Matches `Kam` or `Kim` |
| `[a-z]` | Character range | Matches one character in the specified range | `[A-Z]` | Matches an uppercase English letter |
| `[^abc]` | Negated character class | Matches one character not in the listed set | `[^0-9]` | Matches a non-digit character |
| `{n}` | Exact repetition | Matches preceding item exactly n times | `[0-9]{4}` | Matches four consecutive digits |
| `{n,m}` | Repetition range | Matches preceding item n to m times | `[0-9]{2,4}` | Matches two to four consecutive digits |
| `\d` | Digit | Matches a digit | `\d` | Matches a digit from 0–9 |
| `\w` | Word character | Matches a word character | `\w+` | Matches one or more word characters |
| `\s` | Whitespace | Matches whitespace | `\s` | Matches a space, tab, or similar whitespace |
| `A\|B` | Alternation | Matches either alternative | `Kamal\|Sita` | Matches `Kamal` or `Sita` |

*MongoDB Regex Option*

| Option | Name | Function | Typical Use |
|---|---|---|---|
| `i` | Case-insensitive | Ignores uppercase/lowercase differences | Search `kam` in `Kamal`, `KAMAL`, or `kamal` |
| `m` | Multiline | Makes `^` and `$` match line boundaries in multiline text | Searching individual lines in logs |
| `s` | Dotall | Allows `.` to match newline characters | Matching text across multiple lines |
| `x` | Extended mode | Ignores unescaped pattern whitespace and permits comments | Making complex patterns readable |
| `u` | Unicode mode | Enables Unicode regex mode; generally redundant in modern MongoDB | Usually unnecessary to specify explicitly |


## Pagination
We may have many documents in our DB. Our frontend shouldn't necessarly display all at once. Instead it must split them which is pagination.

we have page and limit so we can calculate skip as `skip = (page - 1) × limit`

page = 3
limit = 10

then : 

Page 3
↓
skip 20
↓
take 10

there may be any no of pages 2 page or 200 page or any . thats why pagination response commonly contsains 

{
    data: [...],
    total: 57,
    page: 3,
    limit: 10,
    totalPages: 6
}

## Sorting
sorting in order 
 1  → ascending
-1 → descending

*Multi-field sorting*
This is also a very useful concept when we want to short the data multiple times. Eg shorting student based on course and age :



## Aggregation
A normal query is primarly asking: which document match?  
Aggrigate ask wht can i calculate, tansform , combine, and summarize from those socuments?

*$match* : filters document inside an aggregation pipeline

{
  $match: {
    course: "Computer Engineering"
  }
}

*$group* : combines document based on a grouping key

{
  $group: {
    _id: "$course",
    totalStudents: {
      $sum: 1
    }
  }
}

*$sum* : counts documentsoe calculate a 
{
  $group: {
    _id: "$course",
    totalStudents: {
      $sum: 1
    }
  }
}

*$avg*
{
  $group: {
    _id: "$course",
    averageMarks: {
      $avg: "$marks"
    }
  }
}


*$max And $min*
{
  $max: "$marks"
}
{
  $mum: "$marks"}


*$sort*
after grouping we can sort the result 
{
  $sort: {
    averageMarks: -1
  }
}

*$project* : $project is an aggregation pipeline stage that controls which fields appear in the output and how those fields are shaped.

It can:
Include fields.
Exclude fields.
Rename fields.
Create calculated fields.
Reshape documents for API responses.

db.students.aggregate([
  {
    $project: {
      name: 1,
      age: 1
    }
  }
])


*$unwind* : $unwind turns one document containing an array into multiple documents.
{
  $unwind: "$courses"
}

*$lookup* : it works like join , combining two schemas 


## Virtual Properties


suppose we have firstName and lastName in our database but we want fullName. in mongoDB it is not necessary to store full name , we can calculate it. This is a virtual property.

## Examples
*Filtering*
Student.find({$and:[{
  age:{$gte:20}},{
 course:{ $in:["Computer Engineering","Computer Science"]}
}]})

Student.find({
  age:{$gte:20 , $lte:30},
   course:{ $in:["Computer Engineering","Computer Science"]},
   name:{
    $regex: "kam",
    $options: "i"
   }}
   
)

*Filter,Sorting,Pagination*
Student.find({
  course: "Computer Engineering",
  
})
.sort( {semester:1,
age: -1})
.skip(10) // (page-1)* limit
.limit(5);

const total = Student.countDocuments({course:"Computer Engineering"});
totalpages = ceil(total/limit)