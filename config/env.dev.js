const dotenv = require("dotenv");

dotenv.config();

const serverPort = process.env.SERVER_PORT;
const clientProdUrl = process.env.CLIENT_PROD_URL;
const clientDevUrl=process.env.CLIENT_DEV_URL;

if (!serverPort) {
    throw new Error(
        ".env is missing a definition of a SERVER_PORT environment variable",
    );
}

if (!clientProdUrl) {
    throw new Error(
        ".env is missing a definition of a CLIENT_PROD_URL environment variable",
    );
}

if (!clientDevUrl) {
    throw new Error(
        ".env is missing a definition of a CLIENT_DEV_URL environment variable",
    );
}

const clientOrigins = [clientProdUrl, clientDevUrl];

module.exports = {
    serverPort,
    clientProdUrl,
    clientDevUrl,
    clientOrigins,
}