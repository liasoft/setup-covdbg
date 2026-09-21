# Contributing to setup-covdbg

Thank you for your interest in contributing to setup-covdbg!

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Making Changes

1. Make your changes in the `src/` directory
2. Build the TypeScript code:
   ```bash
   npm run build
   ```
3. Package the action for distribution:
   ```bash
   npm run package
   ```
4. Commit both the source changes and the compiled `dist/` files

## Testing

Test your changes locally using the test workflow:

1. Push your changes to a branch
2. The test workflow will run automatically on Windows runners
3. Verify that covdbg is properly downloaded and added to PATH

## Project Structure

- `src/main.ts` - Main action logic
- `action.yml` - Action metadata and configuration
- `dist/` - Compiled and bundled action code (must be committed)
- `.github/workflows/` - CI/CD workflows

## Code Style

- Follow existing TypeScript conventions
- Use meaningful variable names
- Add comments for complex logic
- Keep error messages clear and helpful

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the README.md with details of changes if applicable
4. Your PR will be reviewed by maintainers

## Releasing

After the changes are merged into `main`, run the **Release** workflow on `main` with version `1.0.0`:

```bash
gh workflow run release.yml --ref main -f version=1.0.0
```

The workflow rebuilds the action, publishes the `v1.0.0` release, and updates the `v1` tag used by `liasoft/setup-covdbg@v1`. Changing `package.json` alone does not create these Git tags. The action version is independent of the covdbg version selected through the `version` input.

## Questions?

Open an issue for discussion or clarification.
