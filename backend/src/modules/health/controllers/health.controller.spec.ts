import { HealthController } from './health.controller.js'

describe('HealthController', () => {
  it('responde que la API está arriba', () => {
    expect(new HealthController().health()).toEqual({ message: 'API G2I CRM OK' })
  })
})
