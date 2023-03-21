import request from "../utils/request"


function getNetworks() {
    return request({
        url: '/networks'
    })
}

function getContractTokens() {
    return request({
        url: '/tokens'
    })
}

const Metabit = {
    getNetworks,
    getContractTokens
}

export default Metabit