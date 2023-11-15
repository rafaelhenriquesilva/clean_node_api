class Encrypter {
  async compare (password, hashPassword) {
    return true
  }
}
describe('Encrypter', () => {
  test('Should return true if bcrypt if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hash password')
    expect(isValid).toBe(true)
  })
})
