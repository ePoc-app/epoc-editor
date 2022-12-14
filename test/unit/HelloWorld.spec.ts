import { mount } from '@vue/test-utils';
import HelloWorld from '../../src/components/HelloWorld.vue';
import { test, expect } from 'vitest';

test('Hello World', () => {
    const wrapper = mount(HelloWorld);
    const title = wrapper.get('h1');

    expect(title.text()).toBe('Hello Vue 3');
});