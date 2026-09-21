# setup-covdbg

A GitHub Action to download and setup covdbg on Windows runners.

## Description

This action downloads a specified version of covdbg, extracts it, caches it for future runs, and adds it to the PATH so it can be used in subsequent workflow steps.

## Features

- Downloads a user-specified version of covdbg
- Extracts the downloaded archive
- Caches the tool for faster subsequent runs
- Adds covdbg to the PATH automatically
- Supports Windows runners

## Usage

Add this action to your workflow:

```yaml
steps:
  - name: Setup covdbg
    uses: liasoft/setup-covdbg@v1
    with:
      version: '1.3.0'
  
  - name: Run covdbg
    run: covdbg --version
```

## Inputs

### `version` (required)

The version of covdbg to download and setup. Use `1.3.0` for the stable release or `latest` to follow the latest published release. Pin a version for reproducible workflows.

**Example:**
```yaml
with:
  version: '1.3.0'
```

## Outputs

### `covdbg-path`

The path where covdbg was installed and cached.

**Example usage:**
```yaml
- name: Setup covdbg
  id: setup-covdbg
  uses: liasoft/setup-covdbg@v1
  with:
    version: '1.3.0'

- name: Display installation path
  run: echo "Covdbg installed at ${{ steps.setup-covdbg.outputs.covdbg-path }}"
```

## Complete Example Workflow

```yaml
name: Test covdbg

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: windows-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v6
      
      - name: Setup covdbg
        uses: liasoft/setup-covdbg@v1
        with:
          version: '1.3.0'
      
      - name: Verify covdbg installation
        run: |
          covdbg --version
```

## Collecting coverage

Public repositories are free, but CI still authenticates with a project token. Installing covdbg does not sign in to the license service. To collect coverage in CI, add a `COVDBG_PROJECT_TOKEN` Actions secret containing a covdbg project token authorized for your repository, then pass it to the coverage step:

```yaml
- name: Collect coverage
  shell: pwsh
  env:
    COVDBG_PROJECT_TOKEN: ${{ secrets.COVDBG_PROJECT_TOKEN }}
  run: covdbg --config .covdbg.yaml --output coverage.covdb .\build\Debug\test_app.exe
```

See [liasoft/covdbg-quick-start](https://github.com/liasoft/covdbg-quick-start) for a complete C++ example. For local use, sign in with `covdbg login`.

## How It Works

This action uses the GitHub Actions Toolkit, specifically:
- **@actions/core**: For getting inputs, setting outputs, and logging
- **@actions/tool-cache**: For downloading, extracting, and caching the covdbg binary

The action performs the following steps:
1. Reads the `version` input parameter (required; use an explicit version or `latest`)
2. Constructs the download URL for the specified version from covdbg.com
3. Downloads the covdbg.zip archive containing covdbg.exe and libcovdbg.dll
4. Extracts the archive
5. Caches the extracted files for future workflow runs
6. Adds the tool directory to the system PATH
7. Sets the `covdbg-path` output

## Requirements

- Runs on Windows runners (windows-latest or windows-2022)
- Requires the Node.js 24 action runtime and Actions Runner 2.327.1 or newer (automatically available on GitHub-hosted runners)

## Development

To build and package the action:

```bash
# Install dependencies
npm ci

# Build TypeScript
npm run build

# Package for distribution
npm run package
```

> [!NOTE]
> The `dist/` directory is tracked in Git and is what GitHub Actions executes. Commit regenerated `dist/` files whenever the action source changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
