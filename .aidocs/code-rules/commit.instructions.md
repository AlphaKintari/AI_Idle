# Commit Instructions

## General Guidelines

- Always assume that changes should be committed and synced to the remote repository unless otherwise specified.
- Write clear, concise commit messages summarizing the change. Reference the `.aidocs/changelog.md` for details.
- Stage all relevant files before committing.
- Pull the latest changes from the remote repository before pushing to avoid conflicts.
- Push commits to the main branch unless working on a feature or bugfix branch.
- If a merge conflict occurs, resolve it promptly and document the resolution in the changelog.
- Use conventional commit messages if possible (e.g., `feat:`, `fix:`, `docs:`, etc.).

## Example Commit Workflow

1. Review and update `.aidocs/changelog.md` with a datetime and description of your changes.
2. Stage all changed files: `git add .`
3. Commit with a descriptive message: `git commit -m "feat: add new feature (see changelog)"`
4. Pull latest changes: `git pull`
5. Push to remote: `git push`

---
These instructions ensure a consistent and reliable commit process for the AI_Idle project.
