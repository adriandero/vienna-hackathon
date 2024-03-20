import { reactive } from 'vue'

export const DRIVER = 'DRIVER'
export const STORE_OWNER = 'STORE_OWNER'

export const state = reactive({
  mode: null,
  products: [],
  readyForPickup: false
})
