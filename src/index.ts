#!/usr/bin/env node

import { AzureInfraCreator } from './cli/main.js';

async function main() {
  try {
    const creator = new AzureInfraCreator();
    await creator.run();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

main();
