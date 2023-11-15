const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
describe('Encrypter', () => {
  test('Should return true if bcrypt if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })

  test('Should return false if bcrypt if bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const sut = new Encrypter()
    await sut.compare('any_value', 'any_hash')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hash).toBe('any_hash')
  })
})
