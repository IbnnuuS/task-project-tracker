import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../TaskCard.vue'

describe('TaskCard.vue', () => {
    it('renders task props correctly', () => {
        const mockTask = {
            id: 1,
            project_id: 1,
            category_id: null,
            title: 'Setup API Gateway',
            description: 'Configure routing and auth middleware',
            due_date: '2026-10-15',
            created_at: '2026-03-01',
            updated_at: '2026-03-01'
        }

        const wrapper = mount(TaskCard, {
            props: { task: mockTask }
        })

        expect(wrapper.text()).toContain('Setup API Gateway')
        expect(wrapper.text()).toContain('Configure routing and auth middleware')
    })

    it('renders without description if null', () => {
        const mockTask = {
            id: 2,
            project_id: 1,
            category_id: null,
            title: 'Quick Issue Fix',
            description: null,
            due_date: null,
            created_at: '2026-03-01',
            updated_at: '2026-03-01'
        }

        const wrapper = mount(TaskCard, {
            props: { task: mockTask }
        })

        expect(wrapper.text()).toContain('Quick Issue Fix')
        expect(wrapper.find('.desc').exists()).toBe(false)
        expect(wrapper.find('.due').exists()).toBe(false)
    })
})
