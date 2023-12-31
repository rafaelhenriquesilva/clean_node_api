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

const makeTokenGenerator = () => {
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

const makeLoadUserByEmailRepository = () => {
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
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
  }
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }
  const encrypterSpy = new EncrypterSpy()

  return encrypterSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    load () {
      throw new Error()
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

  return loadUserByEmailRepositorySpy
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  const updateAccessTokenRepository = new UpdateAccessTokenRepository()

  return updateAccessTokenRepository
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepository {
    update () {
      throw new Error()
    }
  }

  const updateAccessTokenRepository = new UpdateAccessTokenRepository()

  return updateAccessTokenRepository
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

  test('should call updateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should  if invalid dependecies is provided', async () => {
    const emptyObject = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ loadUserByEmailRepository: emptyObject }),
      new AuthUseCase({ loadUserByEmailRepository }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter: emptyObject }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: emptyObject }),
      new AuthUseCase({ loadUserByEmailRepository, encrypter, tokenGenerator: makeTokenGenerator(), updateAccessTokenRepository: emptyObject })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@gmail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should  if dependecies throws', async () => {
    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepository(), encrypter: makeEncrypterWithError() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepository(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGeneratorWithError() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepository(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator(), updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError() })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@gmail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
