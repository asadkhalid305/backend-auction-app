const success = {
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

module.exports = {
    success,
    client,
    server
}