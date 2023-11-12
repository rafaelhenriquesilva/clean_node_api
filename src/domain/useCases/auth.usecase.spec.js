const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    if (!this.loadUserByEmailRepository) throw new MissingParamError('loadUserByEmailRepository')
    if (!this.loadUserByEmailRepository.load) throw new InvalidParamError('loadUserByEmailRepository')
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) return null
    return this.accessToken
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    email = ''
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('AuthUseCase ', () => {
  test('Should return throws if no email is provider', () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should return throws if no password is provider', () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@gmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@gmail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toEqual('any_email@gmail.com')
  })

  test('Should throw if no loadUserByEmailRepository was provider', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@gmail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('Should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@gmail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
  })

  test('Should return null if loadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('invalid_email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
})
