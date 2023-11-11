class AuthUseCase {
  async auth (email) {
    if (!email) throw new Error()
    return this.accessToken
  }
}
describe('', () => {
  test('Should return throws if no email is provider', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
