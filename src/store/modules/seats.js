 import {getSeats} from "@/api/seats";

export default {
    state: {
        seats: [],
    },
    mutations: {
        SET_SEATS(state, payload) {
            state.seats = payload
        },
    },
    actions: {
        async loadSeats({ commit }, payload) {
            const seats = await getSeats(payload).then(response => response.data)
            commit('SET_SEATS', seats)
        },
    },
    getters: {
        getSeats: (state) => state.seats,
    },
};