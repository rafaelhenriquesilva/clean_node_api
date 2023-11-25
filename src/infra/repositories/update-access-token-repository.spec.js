const { MissingInjectableError, MissingParamError } = require('../../utils/errors')
const Database = require('../config/database')
const UserModel = require('../model/user.model')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const UserRepository = require('./user-repository')

class UpdatedAccessTokenRepository {
  constructor (userRepository) {
    this.userRepository = userRepository
  }

  async updateByEmail (email, token) {
    this.verifyInjectable()
    if (!email) throw new MissingParamError('email')
    if (!token) throw new MissingParamError('token')

    await this.userRepository.updateUserByEmail(email, { token })
  }

  verifyInjectable () {
    if (!this.userRepository) throw new MissingInjectableError('UserRepository')
  }
}

const makeSut = () => {
  const userRepository = new UserRepository(UserModel)
  const sut = new UpdatedAccessTokenRepository(userRepository)
  return {
    sut,
    userRepository
  }
}

describe('LoadUserByEmail Repository', () => {
  let database
  beforeAll(async () => {
    database = new Database()
    await database.connect('local')
  })

  beforeEach(async () => {
    const { userRepository } = makeSut()
    await userRepository.deleteAllUsers()
  })

  test('Should call user repository any user model', () => {
    const userRepository = new UserRepository()
    expect(userRepository.findByEmail('valid_email@mail.com')).rejects.toThrow(new MissingInjectableError('UserModel'))
  })

  test('Should call load user by email repository any user repository', () => {
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    expect(loadUserByEmailRepository.load('alice@example.com')).rejects.toThrow(new MissingInjectableError('UserRepository'))
  })

  test('Should call update acess token user repository any user repository', () => {
    const sut = new UpdatedAccessTokenRepository()
    expect(sut.updateByEmail('alice@example.com', 'valid_token')).rejects.toThrow(new MissingInjectableError('UserRepository'))
  })

  test('Should update the user with the given access token', async () => {
    const userRepository = new UserRepository(UserModel)
    const loadUserByEmailRepository = new LoadUserByEmailRepository(userRepository)

    await userRepository.insertUser('alice@example.com')

    const { sut } = makeSut()

    await sut.updateByEmail('alice@example.com', 'valid_token')

    const userUpdated = await loadUserByEmailRepository.load('alice@example.com')

    expect(!userUpdated).toBe(false)
    expect(!userUpdated[0].token).toBe(false)
    console.info(userUpdated)
    expect(userUpdated[0].token).toBe('valid_token')
  }, 15000)

  test('Should call update acess token user repository any params', () => {
    const { sut } = makeSut()
    expect(sut.updateByEmail('alice@example.com')).rejects.toThrow(new MissingParamError('token'))
    expect(sut.updateByEmail(null, 'valid_token')).rejects.toThrow(new MissingParamError('email'))
  })

  afterAll(async () => {
    await database.disconnect()
  })
})
