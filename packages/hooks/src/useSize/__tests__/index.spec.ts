import { describe, it,  } from 'vitest'
import useSize from '../index'
import renderHook from '../../../test-utils/renderHook'

describe('useSize Hook', () => {  
  it('should not work when target is null', () => {
    renderHook(() => useSize(null))
  })

})

