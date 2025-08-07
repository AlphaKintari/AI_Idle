
# Markdown (.md) File Best Practices

For a complete guide, see: [Markdown Guide - Basic Syntax](https://www.markdownguide.org/basic-syntax/)

## Standard Rules

- **Headings:** Use `#` followed by a space. Always put blank lines before and after headings.
- **Paragraphs:** Separate paragraphs with a blank line. Do not indent paragraphs.
- **Line Breaks:** End a line with two or more spaces or use `<br>` for a line break.
- **Emphasis:**
  - *Italic*: `*italic*` or `_italic_` (prefer asterisks for compatibility)
  - **Bold**: `**bold**` or `__bold__` (prefer asterisks for compatibility)
  - ***Bold and Italic***: `***bold and italic***`
- **Blockquotes:** Start a line with `>`. Use blank lines before and after blockquotes.
- **Lists:**
  - Ordered: Use numbers followed by a period (e.g., `1. Item`)
  - Unordered: Use `-`, `*`, or `+` (do not mix in the same list)
  - Indent nested lists by two spaces
- **Code:**
  - Inline: Enclose code in backticks (`` `code` ``)
  - Block: Indent by four spaces or use triple backticks (```` ``` ````)
- **Horizontal Rules:** Use three or more `*`, `-`, or `_` on a line by themselves, with blank lines before and after.
- **Links:** `[text](url)` or reference-style. URL-encode spaces and parentheses for compatibility.
- **Images:** `![alt text](url "title")`
- **Escaping Characters:** Use a backslash (e.g., `\*` for a literal asterisk).
- **HTML:** Use only if necessary; not all Markdown processors support HTML.

## Mandatory Rule

After editing any markdown file, you must check for formatting or linting issues and fix all problems before considering the task complete.

---
For more details and examples, visit the [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
