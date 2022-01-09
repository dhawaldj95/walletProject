`use strict`;

let serverConfig = {
    MONGODB: {
        HOST: "127.0.0.1",
        PORT: process.env.DB_PORT || 27017,
        NAME: "mongodb",
        CONNECTOR: "mongodb",
        URL: process.env.DB_URL || "mongodb://localhost/walletManagement",
        DATABASE: "demo_dev",
        USER: "",
        PASSWORD: "",
    },
    HOST: process.env.HOST || "0.0.0.0",
    TYPE: "https://",
    PORT: process.env.PORT || '4007',
};

module.exports = serverConfig;
