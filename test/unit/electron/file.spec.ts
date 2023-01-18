import { test, expect } from 'vitest';
import { getRecentFiles } from '@/electron/components/file';

test('getRecentFiles() should return a list of files as a json string', async () => {
    const recentFiles = JSON.parse(getRecentFiles())
    expect(recentFiles.epocs).toBeInstanceOf(Array)
});