interface Config {
  port: string | undefined;
  env: string | undefined;
  sessionSecret: string | undefined;
  saltRounds: number;
  dbConnection: string | undefined;
  clientUrl: string | undefined;
}

const config: Config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  dbConnection: process.env.DB_CONNECTION,
  clientUrl: process.env.CLIENT_URL,
  saltRounds: process.env.NODE_ENV === 'production' ? 12 : 1,
};

if (config.env !== 'test') console.log('config', config);

for (const value of Object.values(config)) {
  if (value === undefined) throw new Error('ERROR: missing to add fields to .env');
}

export default config;
