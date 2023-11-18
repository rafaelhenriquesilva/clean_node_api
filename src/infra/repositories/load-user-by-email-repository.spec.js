const UserModel = require('../model/user.model')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const UserRepository = require('./user-repository')
const Database = require('../config/database')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const userRepository = new UserRepository(UserModel)
  const loadUserRepository = new LoadUserByEmailRepository(userRepository)
  return {
    userRepository,
    loadUserRepository
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

  test('Should return null if no user is found', async () => {
    const { loadUserRepository } = makeSut()

    const user = await loadUserRepository.load('invalid_email@mail.com')
    expect(user).toEqual([])
  }, 15000)

  test('Should return email if user is found', async () => {
    const { userRepository, loadUserRepository } = makeSut()
    await userRepository.insertUser('alice@example.com')

    const user = await loadUserRepository.load('alice@example.com')
    expect(user[0].email).toBe('alice@example.com')
  }, 15000)

  test('Should throw if no UserRepository is provider', async () => {
    const loadUserRepository = new LoadUserByEmailRepository()

    const promise = loadUserRepository.load('any_email@example.com')
    expect(promise).rejects.toThrow()
  }, 15000)

  test('Should throw if no email is provider', async () => {
    const { loadUserRepository } = makeSut()

    const promise = loadUserRepository.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  }, 15000)

  afterAll(async () => {
    await database.disconnect()
  })
})
