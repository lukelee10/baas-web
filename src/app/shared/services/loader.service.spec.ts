import { TestBed } from '@angular/core/testing'

import { LoaderService } from './loader.service'

describe('LoaderService', () => {
  let loaderService: LoaderService

  beforeEach(() => {
    loaderService = TestBed.get(LoaderService)
  })

  it('should be created', () => {
    expect(loaderService).toBeTruthy()
  })

  it('Show with no message shows Loading...', () => {
    loaderService.Show()
    let message: string
    loaderService.message$.subscribe(message1 => (message = message1))
    expect(message).toEqual('Loading...')
  })

  it('Show with  message shows message', () => {
    loaderService.Show('Creating User')
    let message: string
    loaderService.message$.subscribe(value => (message = value))
    expect(message).toEqual('Creating User')
  })

  it('Hide makes the Hides the Loader', () => {
    loaderService.Hide()
    let isLoading: boolean
    loaderService.isLoading$.subscribe(value => (isLoading = value))
    expect(isLoading).toEqual(false)
  })
})
