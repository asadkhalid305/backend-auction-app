const success = {
    ok: 200,
    created: 201,
    accepted: 202
}

const client = {
    badRequest: 400,
    unAuthorized: 401,
    notFound: 404,
    notAcceptable: 406
}

const server = {
    internalServerError: 500,
    serviceUnavailable: 503,
}

//in minutes
const token_expire = 5

module.exports = {
    success,
    client,
    server,
    token_expire
}