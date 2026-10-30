import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as os from 'os';

async function run(): Promise<void> {
  try {
    // Get the version input from the action
    const version = core.getInput('version', { required: true });
    core.info(`Setting up covdbg version ${version}`);

    // Check if we're on Windows
    const platform = os.platform();
    if (platform !== 'win32') {
      throw new Error(`This action currently only supports Windows runners. Current platform: ${platform}`);
    }

    // Resolve the architecture (defaults to the runner's architecture)
    const architecture = (core.getInput('architecture') || os.arch()).toLowerCase();
    if (architecture !== 'x64' && architecture !== 'arm64') {
      throw new Error(`Unsupported architecture: ${architecture}. Supported architectures: x64, arm64`);
    }
    core.info(`Using architecture ${architecture}`);

    // Construct the download URL for covdbg
    // Using the portable version from covdbg.com
    const downloadUrl = version === 'latest'
       ? `https://covdbg.com/download/latest/${architecture === 'arm64' ? 'portable-arm64' : 'portable'}`
       : `https://downloads.covdbg.com/covdbg-${version}-${architecture}.zip`;

    core.info(`Downloading covdbg from ${downloadUrl}`);

    // Download the tool (covdbg.zip)
    let downloadPath: string;
    try {
      downloadPath = await tc.downloadTool(downloadUrl);
    } catch (error) {
      if (error instanceof tc.HTTPError && error.httpStatusCode === 404) {
        throw new Error(
          `covdbg ${version} is not available for ${architecture}` +
          (architecture === 'arm64' ? ' (arm64 builds are available from covdbg 1.5.1)' : '')
        );
      }
      throw error;
    }
    core.info(`Downloaded to ${downloadPath}`);

    // Extract the zip archive (contains covdbg.exe and libcovdbg.dll)
    const extractPath = await tc.extractZip(downloadPath);
    core.info(`Extracted to ${extractPath}`);

    // Cache the tool for future runs
    const cachedPath = await tc.cacheDir(extractPath, 'covdbg', version, architecture);
    core.info(`Cached at ${cachedPath}`);

    // Add the tool to the PATH (both covdbg.exe and libcovdbg.dll are in this directory)
    core.addPath(cachedPath);
    core.info(`Added ${cachedPath} to PATH`);

    // Set the output
    core.setOutput('covdbg-path', cachedPath);
    
    core.info('Successfully set up covdbg');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
