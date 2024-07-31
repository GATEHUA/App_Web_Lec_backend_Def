// Configuracion para pm2
module.exports = {
  apps: [
    {
      name: "app",
      script: "./src/index.js",
      watch: false,
      env: {
        // NODE_ENV: "development",
        NODE_ENV: "production   ",
        PORT: process.env.PORT,
        DB_CONNECTION: process.env.DB_CONNECTION,
        USER_DB: process.env.USER_DB,
        PASSWORD_DB: process.env.PASSWORD_DB,
        FRONT_URL: process.env.FRONT_URL,
        TOKEN_SECRET: process.env.TOKEN_SECRET,
        USER_SEND_EMAILS: process.env.USER_SEND_EMAILS,
        PASSWORD_SEND_EMAILS: process.env.PASSWORD_SEND_EMAILS,
        YOUR_API_KEY_SMS: process.env.YOUR_API_KEY_SMS,
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  ],
};
