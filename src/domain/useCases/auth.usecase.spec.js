const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./AuthUseCase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashPassword) {
      this.password = password
      this.hashPassword = hashPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'

  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    email = ''
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    hashPassword: 'hash_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
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
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@gmail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should  if no dependecy was provider', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@gmail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.auth('any_email@gmail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if an invalid email was provider', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password was provider', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@gmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('should call TokenGenarator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('should retun an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    // toBeTruthy - retorno que tenha valor
    expect(accessToken).toBeTruthy()
  })
})
