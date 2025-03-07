import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', () => {
    const projects = ref([])
    const totalProjects = computed(() => {
        return projects.value ? projects.value.length : 0
    })

    const listProjectsIncludingNull = computed(() => [null].concat(projects.value))
    const listProjectsToFilter = computed(() => [
        null,
        {
            'id': -1,
            'filterDescription': '-- No project --'
        }
    ].concat(projects.value.map((p) => {
        return {
            'id': p.id,
            'filterDescription': p.name
        }
    })))
    const fetchProjects = async () => {
        const response = await axios.get('projects')
        projects.value = response.data.data
    }
    return {
        projects,
        totalProjects, listProjectsIncludingNull, listProjectsToFilter,
        fetchProjects
    }
})