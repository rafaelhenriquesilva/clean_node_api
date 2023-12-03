const config = {
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  testEnviroment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**']
}

module.exports = config
