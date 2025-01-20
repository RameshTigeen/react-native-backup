module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          verbose: false,
          path: `.env.${process.env.APP_ENV || 'development'}`, // Dynamically choose based on APP_ENV
          safe: true, // Optional, ensures environment variabl
        },
      ],
    ],
  };
};
