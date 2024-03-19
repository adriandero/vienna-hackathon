import { reactive } from 'vue'

export const DRIVER = "DRIVER";
export const STORE_OWNER = "STORE_OWNER";

export const state = reactive({
    mode: STORE_OWNER,
    products: [
        {
            id: 'abcdef',
            name: "Test",
            description: "A test product",
        }
    ],
    readyForPickup: false
})