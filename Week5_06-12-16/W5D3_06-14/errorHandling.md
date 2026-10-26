# ERROR HANDLING 

While handling error our goal is not just *"How do i catch an error?"* , The real backend question is : *Where should an error be detected, where should it be handled, where should it be logged, and where should the client receive the response?*

Imagine we have existing Student API 
POST /students
GET /students
GET /students/:id
GET /students/with-course

SUppose someone sends : 
{
  "name": "Kamal",
  "age": 23,
  "email": "invalid"
}

several things could go wrong 

*Case 1 : VAlidation Error* 
This request is invalid  : Client -> Validation -> Invalid email
so there is no reason to call COntroller - service - Repository - MongoDB . We should reject it early.

*Case 2 : Student doesn't exist*
GET /students/abc123 
suppose mongoDB succesfully executes the query but no student exists. That's not necessarly a server failure . it's a meaningful application condition: Student not found -> HTTP 404

*Case 3 : Database faliure*
SUppose the mongoDB becomes unavailable: 
Repository
   ↓
MongoDB
   ↓
❌ connection/query failure
The controller shouldn't have to know how to format every possible database error. Instead 
Repository
    ↓
throws error
    ↓
Service/Controller
    ↓
next(error)
    ↓
Global Error Handler


*Case 4 : Programmer / Unexpected error*
Something completely unexpected happens: TypeError/ReferenceError/Unexpected MongoDB error
We dont want : server crashes/ HTML error page/stack trace exposed to client. 
We want something like 
{
  "success": false,
  "message": "Internal Server Error"
}
while the real technical error goes into our logs.


normal middleware : (req, res, next)
Error Middleware : (err, req, res, next)


### Global error handler

Responsible for the application's final centralized error response.

Example:

Controller
   ↓
next(error)
   ↓
GLOBAL ERROR HANDLER
   ↓
HTTP response

### Route-specific handling

Sometimes a particular route needs special logic.

For example:
POST /students

might need to deal with:
duplicate email

differently from:
database unavailable

But even here, we don't necessarily want every controller generating its own response.
A route/controller can identify or create the appropriate error, then forward it.


## The Most Important Error Flow

Something fails
      ↓
Where did it fail?
      ↓
Can this layer solve it?
      │
      ├── Yes → handle it
      │
      └── No
           ↓
       propagate error
           ↓
      global handler
           ↓
        log error
           ↓
     choose HTTP status
           ↓
      send response

### Why We Don't Put res.status() Everywhere

Repository should not do res.status(500) because repository doesnot belongs to HTTP.It should know database operations not HTTP statuscode/responce and Express request/response.
Similarly, Service should primarly know business logic rather than constructinf HTTP responses.

so we maintain seperation:
Repository
→ database

Service
→ business logic

Controller
→ HTTP interaction

Middleware
→ cross-cutting HTTP concerns

# Logging
Morgan handles per-request/access logging, while Winston handles structured application events and errors.
Morgan : "What HTTP requests are coming into my server?"
Winston : "What is happening inside my application?"

Example : POST /students
morgan tell about : POST /students 400 12ms
but it doesnto necessarly tell us why . 
Winston can record:
POST /students 400 12ms

SO, 
Morgan
=
HTTP traffic visibility

Winston
=
Application visibility


`npm install morgan winston`

# Validation
Consider : 
{
  "name": "A",
  "age": 999,
  "email": "hello"
}

here are 3 invalid values so the request must be rejected as early as possible. Conceptualy
 {
  "name": "A",
  "age": 999,
  "email": "hello"
}

Instead of: 
Client
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
   ↓
❌

## Validation Has Multipple Layers
*Layer 1 : Request validation*
CHecks:
Is email valid?
Is age a number?
Is name present?
Is required field missing?

Usually middleware.

*Layer 2 : Business Validation*
checks rules like :
Can this student enroll in this course?
Is this operation allowed?
Does this condition make business sense?

Usually service layer

*Layer 3 : Database/Schema validation*
Mongooe can enforse things suc as :
required
min
max
enum
unique-related constraints
type

so validation isn't one single thing . Each layer of validation protects different boundary.

Although mongoose alreaddy validate we use validate because mongoose validation happens relatevely late. Request validation can stop bad data much earlier.That means:
- less unnecessary processing 
- cleaner client errors
- cleaner business logic 
- predictable API contracts

But database validation is still valuable because not every write necessarily comes through the same HTTP route.

Therefore, *Request validation and database validation are complementary, not necessarily replacements.* 


`npm install express-validator`