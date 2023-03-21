import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

const service = axios.create({
    baseURL: 'https://test-metabit.metarsier.com',
    timeout: 60000
})

service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config
})

service.interceptors.response.use((res: AxiosResponse) => {
    if (res.data.code !== 200) {
        return Promise.reject(res)
    }
    return res
}, (err: AxiosError) => {
    console.log(err)
    return Promise.reject(err)
})

export default service