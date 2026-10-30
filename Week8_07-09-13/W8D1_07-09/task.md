# Week 6:Day 5: Project: Mini Auth Module with React UI

*Description*
- Apply this week's authentication, authorization, and React fundamentals by building a small full-stack module: a backend that issues and verifies JWTs with role-based route protection, paired with a basic React frontend that consumes it using components, props, state, and lifecycle behavior.

*Scope*
- Implement a login endpoint that issues a JWT and middleware that protects backend routes using that JWT.
- Implement role-based access control on at least one protected route (e.g., admin-only vs. regular user).
- Build a simple React UI with a login form and a protected page, using functional components, props, and state.
- Use a lifecycle hook (e.g., useEffect) to fetch and display protected data after the user logs in.
- Document the day's key learnings, findings, and code snippets in a dedicated learning-log file (Markdown/Doc) and commit it to the repository.
- Raise a GitHub Pull Request for this project and send it to your mentor for review.

*Acceptance Criteria*
- Users can log in and receive a valid JWT; protected routes reject requests without a valid token.
- Access to the role-restricted route is correctly limited based on user role.
- The React UI logs the user in, stores the token, and displays protected data only after authentication.
- The lifecycle hook correctly triggers the protected data fetch after login (not before).
- A daily learning-log file capturing this week's topics and key takeaways is created/updated and committed to the repository.
- A GitHub PR is raised for this work and sent to the mentor for review.
- The learning-log file link and the PR link are both posted in the Open Project task's comment section and in the corresponding Microsoft Teams comment/thread.