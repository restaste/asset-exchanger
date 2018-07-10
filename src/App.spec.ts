import * as supertest from 'supertest'
import { App } from './App'

describe('App', () => {
  it('works', () =>
    supertest(new App('', '', []).express)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
  )
})
