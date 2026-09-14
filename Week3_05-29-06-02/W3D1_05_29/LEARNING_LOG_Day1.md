# Learning Log: Week 3 Todo App - Dynamic DOM Manipulation
*September 14, 2026*

Today I extended the Week 1 Todo App into an interactive task manager. I used HTML, CSS, and vanilla JavaScript to create task elements dynamically and connect the controls to an in-memory task list.

## Project Goal

The goal was to practice dynamic DOM manipulation by allowing users to add, edit, delete, complete, and filter tasks while keeping the task summary updated.

## What I Implemented

### HTML and Styling

I kept the Todo App structure from Week 1 and added a task form containing a text input, category select, and Add button. The page also contains filter buttons, an empty unordered list for dynamically created tasks, a summary area, and the date/time display. The logo image is included in the header.

The CSS continues to use custom properties for colors and responsive layout rules. It styles the form, task rows, category text, action buttons, completed tasks, filters, summary, and footer. A checked task receives a completed visual style through CSS selectors.

### Adding Tasks

The Add button reads the task title and selected category. The title is trimmed and empty titles are ignored. Valid input creates an object with an id, title, category, and `completed` property. The object is pushed into the `tasks` array, rendered immediately, and the input is cleared and focused.

### Dynamic DOM Rendering

The `displayTask()` function creates a task list item with `document.createElement()`. It creates the checkbox, title, category, delete button, and edit button, assigns classes and text, appends them to the list, and attaches event listeners to the new controls.

### Completing, Editing, and Deleting Tasks

The checkbox changes the task object's `completed` value and updates the summary. The Edit button uses `prompt()` to request a new title. A non-empty title updates both the task object and the displayed label. The Delete button removes the task from the `tasks` array, removes its list item from the DOM, and updates the summary.

### Filtering and Summary State

The All, Active, and Completed buttons clear the visible list and render the matching tasks from the complete `tasks` array. This means filtering does not delete hidden tasks. The summary counts active and completed tasks directly from the same array.

## What I Learned

1. DOM elements can be created, appended, and removed while the page is running.
2. An array of task objects can hold the application's current state.
3. Event listeners for dynamically created controls must be attached when those controls are created.
4. Filtering a complete data array keeps hidden tasks available when the view changes.
5. `textContent` displays user-entered titles as text instead of HTML.
6. Trimming input and rejecting empty titles provides basic input validation.
7. A form submit handler with `preventDefault()` is still needed to fully prevent page reloads when the form is submitted with Enter.

## Verification Checklist

- [x] Add a task by clicking the Add button.
- [x] Mark a task completed and update the summary.
- [x] Edit a task with a prompt.
- [x] Delete a task from the array and the DOM.
- [x] Filter All, Active, and Completed tasks.
- [x] Keep hidden tasks in the main task array when filtering.
- [x] Check the JavaScript syntax with `node --check`.
- [ ] Prevent the form's default submit behavior with `preventDefault()`.
- [ ] Test the app in a browser at mobile, tablet, and desktop widths.
