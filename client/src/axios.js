import axios from "axios"

export const makeRequest = axios.create({
    baseURL: "https://mysocialbackend.herokuapp.com/api/",
    withCredentials: true,
})