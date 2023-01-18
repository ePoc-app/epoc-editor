import { test, expect } from 'vitest';
import { EventEmitter } from 'node:events';
import { wait, waitAll, waitEvent } from '@/electron/components/utils'

test('wait() should wait x amount of time to resolve', async () => {
    const startTime = performance.now();
    await wait(50);
    const endTime = performance.now();
    const delay = endTime-startTime;

    expect(delay).toBeGreaterThan(48)
    expect(delay).toBeLessThan(52)
});

test('waitAll() should wait for all promises to have resolves', async () => {
    let result = 0;
    const p1 = wait(20)
    const p2 = wait(30)
    p1.then(() => { result++ })
    p2.then(() => { result++ })

    await waitAll([p1, p2])
    expect(result).toBe(2)
})

test('waitEvent() should wait for an event to have fire once', async () => {
    let result = 0;
    const e = new EventEmitter();
    waitEvent(e, 'test').then(() => { result++ });
    e.emit('test')
    await wait(20)
    e.emit('test')

    expect(result).toBe(1)
})