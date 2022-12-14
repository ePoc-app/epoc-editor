import { mount } from '@vue/test-utils';
import ChartFlow from '../../src/components/ChartFlow.vue';
import { test, expect } from 'vitest';

test('sum() should do basic addition', () => {
    const wrapper = mount(ChartFlow);
    //@ts-ignore
    const result = wrapper.vm.sum(1, 2);

    expect(result).toBe(3);
});