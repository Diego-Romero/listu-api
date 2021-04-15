interface Config {
  port: string | undefined;
  env: string | undefined;
  sessionSecret: string | undefined;
  saltRounds: number;
}

const config: Config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  sessionSecret: process.env.SESSION_SECRET,
  saltRounds: process.env.NODE_ENV === 'production' ? 12 : 1,
};

for (const value of Object.values(config)) {
  if (value === undefined) throw new Error('ERROR: missing to add fields to .env');
}

export default config;
