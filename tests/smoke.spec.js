import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders msg and increments counter', async () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Vite + Vue' } })
    expect(wrapper.text()).toContain('Vite + Vue')

    const btn = wrapper.get('button')
    expect(btn.text()).toContain('count is 0')

    await btn.trigger('click')
    expect(btn.text()).toContain('count is 1')
  })
})
