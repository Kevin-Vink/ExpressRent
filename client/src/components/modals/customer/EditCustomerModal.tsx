import React, { type FunctionComponent, useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/store'
import { type Customer } from '../../../../../common/types'
import axios from 'axios'
import { toast } from 'react-toastify'
import ConfirmationModal from './../ConfirmationModal'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

interface Props {
  customer: Customer | undefined
  handleClose: (update: boolean) => void
}

const EditCustomerModal: FunctionComponent<Props> = (props: Props) => {
  const {
    handleClose,
    customer
  } = props

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const { customers } = useAppSelector(state => state.customers)

  const [newName, setNewName] = useState<string>('')
  const [newDateBirth, setNewDateBirth] = useState<Date>(new Date())
  const [newEmail, setNewEmail] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleEditClose = (): void => {
    if (newName !== customer?.name || newEmail !== customer?.email || newDateBirth !== customer?.dateBirth) {
      setShowConfirmationModal(true)
    } else {
      handleClose(false)
    }
  }

  useEffect(() => {
    if (customer) {
      setNewName(customer.name)
      setNewDateBirth(customer.dateBirth)
      setNewEmail(customer.email)
    }
  }, [customer])

  useEffect(() => {
    if (newEmail === '') {
      setError('Email cannot be empty')
    } else if (customers.find(c => c.email.toLowerCase() === newEmail.toLowerCase() && c.id !== customer?.id)) {
      setError('Customer with this email already exists')
    } else {
      setError('')
    }
  }, [newEmail])

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleEditClose()
      }
      if (e.key === 'Enter' && newName !== '' && newEmail !== '' && newDateBirth !== undefined && error === '' && customers.find(c => c.email.toLowerCase() === newEmail.toLowerCase()) === undefined &&
          newName !== customer?.name || newEmail !== customer?.email || newDateBirth !== customer?.dateBirth) {
        handleSubmit()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [newName, newDateBirth, newEmail, error])

  const formatDate = (date: Date | undefined): string => {
    if (date) return new Date(date).toISOString().split('T')[0]
    return ''
  }

  const handleSubmit = (): void => {
    if (!customer) return

    const newCustomer: Customer = {
      name: newName,
      dateBirth: newDateBirth,
      email: newEmail
    }

    axios.put(`${process.env.REACT_APP_SERVER_URL}/customers/${customer.id}`, newCustomer).then(() => {
      toast.success(`Updated ${newName}!`)
      handleClose(true)
    }).catch((err) => toast.error(err.message))
  }

  return (
        <>
            <div className="fixed w-full min-h-screen z-30 top-0 left-0 bg-black/90 flex items-center justify-center"
                 onClick={handleEditClose}>
                <div className="bg-neutral-900 w-1/2 z-40 rounded-md overflow-hidden flex flex-col gap-2"
                     onClick={(e) => e.stopPropagation()}>
                    {customer && (
                        <div className="flex flex-col gap-3 p-4">
                            <h2 className="font-bold text-lg text-white w-full border-b border-neutral-700 pb-1">Update {customer?.name}</h2>
                            <div className="flex flex-col gap-y-4 text-white pr-8">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                                    <div className="relative flex items-center">
                                        <input type="text" name="name" id="name" placeholder="Name"
                                               value={newName}
                                               onChange={(e) => setNewName(e.target.value)}
                                               className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                      {newName !== customer.name && (
                                      <div className="absolute -right-8">
                                        <ArrowUturnLeftIcon onClick={() => setNewName(customer.name)}
                                                            className="w-5 text-red-500 h-auto"/>
                                      </div>
                                      )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4 text-white pr-8">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="dateBirth">Date of Birth <span
                                        className="text-red-500">*</span></label>
                                    <div className="relative flex items-center">
                                        <input type="date" name="dateBirth" id="dateBirth" placeholder="dateBirth"
                                               value={formatDate(newDateBirth)}
                                               onChange={(e) => setNewDateBirth(new Date(e.target.value))}
                                               className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                      {newDateBirth !== customer.dateBirth && (
                                          <div className="absolute -right-8">
                                            <ArrowUturnLeftIcon onClick={() => setNewDateBirth(customer?.dateBirth)}
                                                                className="w-5 text-red-500 h-auto"/>
                                          </div>
                                      )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4 text-white pr-8">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="email">Email <span className="text-red-500">*</span></label>
                                    <div className="relative flex items-center">
                                        <input type="email" name="email" id="email" placeholder="Email"
                                               value={newEmail}
                                               onChange={(e) => setNewEmail(e.target.value)}
                                               className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                      {newEmail !== customer.email && (
                                          <div className="absolute -right-8">
                                            <ArrowUturnLeftIcon onClick={() => setNewEmail(customer?.email)}
                                                                className="w-5 text-red-500 h-auto"/>
                                          </div>
                                      )}
                                    </div>
                                    {error !== '' && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w-full bg-neutral-800 px-4 py-2 flex items-center justify-end">
                        <button type="button"
                                onClick={handleEditClose}
                                className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white hover:text-gray-300 transition-all sm:mt-0 sm:w-auto">Cancel
                        </button>
                        <button type="button"
                                onClick={handleSubmit}
                                disabled={newName === customer?.name && newEmail === customer.email && newDateBirth === customer.dateBirth || newName === '' || newEmail === '' || newDateBirth === undefined || error !== ''}
                                className="inline-flex disabled:bg-neutral-500 w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 sm:ml-3 sm:w-auto">Save
                            Changes
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

export default EditCustomerModal
