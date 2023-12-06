const LoginRouter = require('../../presentantion/routers/login-router')
const EmailValidator = require('../../utils/email-validator')
const AuthUseCase = require('../../domain/useCases/AuthUseCase')
const LoadUserByEmailRepository = require('./../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('./../../infra/repositories/update-access-token-repository')
const UserRepository = require('./../../infra/repositories/user-repository')
const UserModel = require('./../../infra/model/user.model')
const Encrypter = require('../../utils/encrypter')
const TokenGenerator = require('../../utils/token-generator')

const encrypter = new Encrypter()
const tokenGenerator = new TokenGenerator('secret_key')
const userRepository = new UserRepository(UserModel)
const loadUserByEmailRepository = new LoadUserByEmailRepository(userRepository)
const updateAccessTokenRepository = new UpdateAccessTokenRepository(userRepository)
const emailValidator = new EmailValidator()
const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  encrypter,
  tokenGenerator
})

const router = new LoginRouter({
  authUseCase,
  emailValidator
})

module.exports = router
