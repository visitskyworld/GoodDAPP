// @flow

// libraries
import React, { useCallback, useEffect, useState } from 'react'
import { isFunction, noop } from 'lodash'

// components
import SwitchToChromeOrSafari from '../components/SwitchToChromeOrSafari'

// hooks
import useMountedState from '../../../lib/hooks/useMountedState'
import { useDialog } from '../../../lib/undux/utils/dialog'

// utils
import logger from '../../../lib/logger/js-logger'
import { isAndroidWeb, isBrowser, isChrome, isIOSWeb, isSafari } from '../../../lib/utils/platform'

const log = logger.get('useBrowserSupport')

export default (options = {}) => {
  const {
    onCheck = null,
    onChecked = noop,
    onSupported = noop,
    onUnsupported = noop,
    checkOnMounted = true,
    unsupportedPopup = null,
  } = options

  const [showDialog] = useDialog()
  const mountedState = useMountedState()
  const [isSupported, setSupported] = useState(false)
  const UnsupportedPopup = unsupportedPopup || SwitchToChromeOrSafari

  const showPopup = useCallback(
    ({ onDismiss = noop, ...props }) =>
      showDialog({
        isMinHeight: false,
        showButtons: false,
        onDismiss,
        ...props,
      }),
    [showDialog],
  )

  const handleSupported = useCallback(() => {
    onChecked(true)
    onSupported()

    if (mountedState.current) {
      setSupported(true)
    }
  }, [onChecked, onSupported, setSupported])

  const handleUnsupported = useCallback(() => {
    const onDismiss = () => {
      onChecked(false)
      onUnsupported()
    }

    showPopup({
      type: 'error',
      content: <UnsupportedPopup onDismiss={onDismiss} />,
      onDismiss: onDismiss,
    })
  }, [onChecked, onUnsupported, showPopup])

  const requestFlow = useCallback(() => {
    // re-checking mounted state after each delayed / async operation as send link
    // screen could call redirect back if error happers during processing transaction
    if (!mountedState.current) {
      return
    }

    let isSupported = (isIOSWeb && isSafari) || (isAndroidWeb && isChrome) || (isBrowser && (isSafari || isChrome))

    if (isFunction(onCheck)) {
      isSupported = onCheck(isSupported)
    }

    log.debug({ isSupported })

    isSupported ? handleSupported() : handleUnsupported()
  }, [onChecked, onSupported, handleUnsupported, handleSupported])

  const checkForBrowserSupport = useCallback(() => {
    if (!checkOnMounted) {
      requestFlow()
    }
  }, [requestFlow, checkOnMounted])

  useEffect(() => {
    if (checkOnMounted) {
      requestFlow()
    }
  }, [])

  return [isSupported, checkForBrowserSupport]
}
