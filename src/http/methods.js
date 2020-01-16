import fetch from './request'
import api from './api'

export let humming = (params={})=>{
    return fetch.post(api.humming,params)
}
export let mix = (params={})=>{
    return fetch.post(api.mix,params)
}