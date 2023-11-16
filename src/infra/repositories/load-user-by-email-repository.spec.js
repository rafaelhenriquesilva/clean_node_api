const UserModel = require('../model/user.model')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const UserRepository = require('./user-repository')
const Database = require('../config/database')
describe('LoadUserByEmail Repository', () => {
  let database, connection
  beforeAll(async () => {
    database = new Database()
    connection = await database.connect('local')
  })

  beforeEach(async () => {
    const userRepository = new UserRepository(UserModel)
    await userRepository.deleteAllUsers()
  })

  afterAll(async () => {
    await connection.close()
  })

  test('Should return null if no user is found', async () => {
    const userRepository = new UserRepository(UserModel)
    const loadUserRepository = new LoadUserByEmailRepository(userRepository)

    const user = await loadUserRepository.load('invalid_email@mail.com')
    expect(user).toEqual([])
  }, 15000)

  test('Should return email if user is found', async () => {
    const userRepository = new UserRepository(UserModel)
    const loadUserRepository = new LoadUserByEmailRepository(userRepository)
    await userRepository.insertUser('alice@example.com')

    const user = await loadUserRepository.load('alice@example.com')
    expect(user[0].email).toBe('alice@example.com')
  }, 15000)
})
