import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../store/store'
import { type Customer } from '../../../common/types'
import axios from 'axios'
import { toast } from 'react-toastify'
import ConfirmationModal from './ConfirmationModal'

interface Props {
  handleClose: (update: boolean) => void
}

const CreateCustomerModal: FunctionComponent<Props> = (props: Props) => {
  const { handleClose } = props

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const { customers } = useAppSelector(state => state.customers)

  const [name, setName] = useState<string>('')
  const [dateBirth, setDateBirth] = useState<Date>(new Date())
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleEditClose = (): void => {
    if (name) {
      setShowConfirmationModal(true)
    } else {
      handleClose(false)
    }
  }

  useEffect(() => {
    if (email === '') {
      setError('Email cannot be empty')
    } else if (customers.find(c => c.email.toLowerCase() === email.toLowerCase())) {
      setError('Customer with this email already exists')
    } else {
      setError('')
    }
  }, [email])

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleEditClose()
      }
      if (e.key === 'Enter' && name !== '' && email !== '' && dateBirth !== undefined && error === '') {
        handleSubmit()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [name, dateBirth, email, error])

  const formatDate = (date: Date | undefined): string => {
    if (date) return new Date(date).toISOString().split('T')[0]
    return ''
  }

  const handleSubmit = (): void => {
    const newCustomer: Customer = {
      name,
      dateBirth,
      email
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/customers`, newCustomer).then(() => {
      toast.success(`Created ${name}!`)
      handleClose(true)
    }).catch((err) => toast.error(err.message))
  }

  return (
      <>
          <div className="fixed w-full min-h-screen z-30 top-0 left-0 bg-black/90 flex items-center justify-center"
               onClick={handleEditClose}>
              <div className="bg-neutral-900 w-1/2 z-40 rounded-md overflow-hidden flex flex-col gap-2"
                   onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-3 p-4">
                      <h2 className="font-bold text-lg text-white w-full border-b border-neutral-700 pb-1">Create a new
                          customer</h2>
                      <div className="flex flex-col gap-y-4 text-white">
                          <div className="flex flex-col gap-1">
                              <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                              <div className="relative flex items-center">
                                  <input type="text" name="name" id="name" placeholder="Name"
                                         value={name}
                                         onChange={(e) => setName(e.target.value)}
                                         className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                              </div>
                          </div>
                      </div>
                      <div className="flex flex-col gap-y-4 text-white">
                          <div className="flex flex-col gap-1">
                              <label htmlFor="dateBirth">Date of Birth <span className="text-red-500">*</span></label>
                              <div className="relative flex items-center">
                                  <input type="date" name="dateBirth" id="dateBirth" placeholder="dateBirth"
                                         value={formatDate(dateBirth)}
                                         onChange={(e) => setDateBirth(new Date(e.target.value))}
                                         className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                              </div>
                          </div>
                      </div>
                      <div className="flex flex-col gap-y-4 text-white">
                          <div className="flex flex-col gap-1">
                              <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                              <div className="relative flex items-center">
                                  <input type="email" name="email" id="email" placeholder="Email"
                                         value={email}
                                         onChange={(e) => setEmail(e.target.value)}
                                         className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                              </div>
                              {error !== '' && (
                                  <p className="text-red-500 text-sm">{error}</p>
                              )}
                          </div>
                      </div>
                  </div>
                  <div className="w-full bg-neutral-800 px-4 py-2 flex items-center justify-end">
                      <button type="button"
                              onClick={handleEditClose}
                              className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white hover:text-gray-300 transition-all sm:mt-0 sm:w-auto">Cancel
                      </button>
                      <button type="button"
                              onClick={handleSubmit}
                              disabled={name === '' || email === '' || dateBirth > new Date() || error !== ''}
                              className="inline-flex disabled:bg-neutral-500 w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 sm:ml-3 sm:w-auto">Create
                          Customer
                      </button>
                  </div>
              </div>
          </div>
          {showConfirmationModal &&
              <ConfirmationModal handleConfirm={() => handleClose(false)}
                                 handleClose={() => setShowConfirmationModal(false)}/>}
      </>
  )
}

export default CreateCustomerModal
