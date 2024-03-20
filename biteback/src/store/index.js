import { reactive } from 'vue'

export const DRIVER = "DRIVER";
export const STORE_OWNER = "STORE_OWNER";

export const state = reactive({
    mode: STORE_OWNER,
    products: [
        {
            id: 'mnop78',
            name: "Grapes",
            img: null,
            description: "A nice grapes",
        }
    ],
    readyForPickup: false
})