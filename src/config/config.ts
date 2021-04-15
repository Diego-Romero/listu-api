interface Config {
  port: string | undefined;
  env: string | undefined;
  sessionSecret: string | undefined;
  saltRounds: number;
  dbConnection: string | undefined;
}

const config: Config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  dbConnection: process.env.DB_CONNECTION,
  saltRounds: process.env.NODE_ENV === 'production' ? 12 : 1,
};

console.log('config', config);

for (const value of Object.values(config)) {
  if (value === undefined) throw new Error('ERROR: missing to add fields to .env');
}

export default config;
