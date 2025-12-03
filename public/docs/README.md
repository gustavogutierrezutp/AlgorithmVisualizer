# Documentation

This folder contains the Quarto-generated documentation for the project.

## Updating Documentation

After making changes to the Quarto source files in `doc/`:

1. Regenerate the documentation:
   ```bash
   cd doc
   quarto render
   ```

2. Sync the updated documentation to the public folder:
   ```bash
   npm run docs:sync
   ```

3. Commit and push the changes to deploy to GitHub Pages.

## Source Files

The source files are located in the `doc/` directory at the project root.
