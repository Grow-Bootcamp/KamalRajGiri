# Learning Log: Week 1 Todo App - Responsive UI
*September 7, 2026*

Today I applied the HTML5, CSS, and JavaScript fundamentals from Week 1 to build the first version of a responsive Todo App interface. The main focus was creating a clear layout that works on mobile, tablet, and desktop screens.

## Project Goal

The project requirements were to:

- Build a static Todo App UI with HTML5 and CSS.
- Use semantic page structure and meaningful class names.
- Apply the CSS box model, selectors, Flexbox, Grid, and responsive breakpoints.
- Avoid horizontal scrolling and broken layouts at common screen sizes.

## What I Implemented

### HTML5 Structure

The page is organized into semantic sections:

- A `header` containing the application title, logo, navigation content, and current date/time.
- A `main` element containing the task form and task list.
- A summary section showing remaining and completed task information.
- A `footer` containing the closing message and copyright text.

The form includes a text input, a category select menu, and an add button. The task list includes a checkbox, task title, category, and delete button. Labels are connected to their form controls with matching `for` and `id` attributes.

### CSS Layout and Box Model

I used the universal selector to reset default spacing and applied `box-sizing: border-box` so padding and borders are included in an element's declared size.

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

The page uses CSS custom properties for colors, which keeps the design consistent and makes future theme changes easier. Cards, inputs, buttons, borders, spacing, and shadows demonstrate the box model in a practical interface.

### Flexbox and Grid

I used Flexbox for one-dimensional layouts:

- Stacking the header content and footer content.
- Aligning the navigation information.
- Arranging each task row and its delete button.
- Aligning the filter buttons and task details.

I used CSS Grid for the task input area. On small screens, the input, category selector, and add button appear in one column. At widths of `600px` and above, the layout changes to two flexible columns and an action column:

```css
@media (min-width: 600px) {
    .input {
        grid-template-columns: 2fr 1fr auto;
    }
}
```

This keeps controls easy to use on mobile while making better use of available space on tablets and desktops.

### Selectors and Interaction States

The stylesheet uses element, class, descendant, attribute-adjacent, pseudo-class, and relational selectors. Examples include:

- `:hover` and `:active` states for buttons and task cards.
- `:checked + .task-info .task-title` to style a completed task.
- `:has(.task-checkbox:checked)` to change the completed task card background.

When the checkbox is selected, the task title is crossed out and its color becomes less prominent. This gives the user immediate visual feedback without requiring JavaScript.

### JavaScript Date and Time

The JavaScript file currently demonstrates DOM selection, the `Date` object, ISO date formatting, local date formatting, and repeated execution with `setTimeout`.

```javascript
(function update() {
    const date = new Date();
    document.getElementById("time").dateTime = date.toISOString();
    document.getElementById("time").textContent = date.toLocaleString();
    setTimeout(update, 1000);
})();
```

The IIFE starts the clock immediately when the page loads, and the `defer` attribute allows the HTML to be parsed before the script runs.

## What I Learned

1. `box-sizing: border-box` makes responsive sizing easier to reason about.
2. Flexbox is useful for arranging related content along one axis, while Grid is useful for defining columns and rows.
3. `max-width` and automatic horizontal margins can keep content readable on wide screens.
4. Responsive layouts should start with a simple small-screen arrangement and add columns at larger breakpoints.
5. CSS pseudo-classes can provide useful interaction feedback even in a static prototype.
6. Semantic HTML improves the organization and meaning of the page before visual styling is added.

## Verification Checklist

- [x] Header, task form, task list, summary, and footer are visible.
- [x] The form uses one column on small screens.
- [x] The form uses multiple columns from `600px` upward.
- [x] Task rows use flexible alignment and do not require fixed page widths.
- [x] The page uses `max-width` and `box-sizing: border-box` to reduce overflow risk.
- [x] Hover, active, checked, and completed-task styles are defined.
- [ ] Test the page in a browser at mobile, tablet, and desktop widths.
- [ ] Add JavaScript behavior for adding, deleting, filtering, and counting tasks.

## Next Steps

The current deliverable is a responsive static UI, as required by the Week 1 scope. The next implementation step is to connect the controls to JavaScript so users can add tasks, delete tasks, filter active and completed tasks, and keep the summary counts synchronized with the list.