import React, { type FunctionComponent, useEffect } from 'react'

interface Props {
  handleConfirm: () => void
  handleClose: () => void
}

const ConfirmationModal: FunctionComponent<Props> = (props: Props) => {
  const {
    handleConfirm,
    handleClose
  } = props

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [])

  return (
        <div className="fixed top-0 left-0 text-white bg-black/70 w-full h-screen z-50 flex items-center justify-center">
            <div
                className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-neutral-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div
                            className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold leading-6 text-white" id="modal-title">Cancel
                                changes</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-300">Are you sure you want to cancel editing?
                                    you still have changes that will be lost if you cancel.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="button"
                            onClick={handleConfirm}
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Revert Changes
                    </button>
                    <button type="button"
                            onClick={handleClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white hover:text-gray-300 transition-all sm:mt-0 sm:w-auto">Cancel
                    </button>
                </div>
            </div>
        </div>
  )
}

export default ConfirmationModal
