interface Config {
  port: string | undefined;
  env: string | undefined;
  sessionSecret: string | undefined;
  saltRounds: number;
  dbConnection: string | undefined;
  clientUrl: string | undefined;
  sendGridApiKey: string | undefined;
  jwtSecret: string | undefined;
  awsAccessKey: string | undefined;
  awsSecretAccessKey: string | undefined;
}

const config: Config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  dbConnection: process.env.DB_CONNECTION,
  clientUrl: process.env.CLIENT_URL,
  saltRounds: process.env.NODE_ENV === 'production' ? 12 : 1,
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

if (config.env !== 'test') console.log('config', config);

for (const value of Object.values(config)) {
  if (value === undefined) throw new Error('ERROR: missing to add fields to .env');
}

export default config;
