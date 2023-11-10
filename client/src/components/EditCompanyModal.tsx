import React, { type FunctionComponent, useEffect, useState } from 'react'
import type { Company } from '../../../common/types'
import ConfirmationModal from './ConfirmationModal'
import { useAppSelector } from '../store/store'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { toast } from 'react-toastify'

interface Props {
  company: Company | undefined
  handleClose: (update: boolean) => void
}

const EditCompanyModal: FunctionComponent<Props> = (props: Props) => {
  const {
    company,
    handleClose
  } = props

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const { companies } = useAppSelector(state => state.companies)

  const [newName, setNewName] = useState<string>(company?.name ?? '')
  const [error, setError] = useState<string>('')

  const handleEditClose = (): void => {
    if (newName !== company?.name) {
      setShowConfirmationModal(true)
    } else {
      handleClose(false)
    }
  }

  useEffect(() => {
    if (newName === '') {
      setError('Name cannot be empty')
    } else if (companies.find(c => c.name.toLowerCase() === newName.toLowerCase() && c.id !== company?.id)) {
      setError('Company with this name already exists')
    } else {
      setError('')
    }
  }, [newName])

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleEditClose()
      }
      if (e.key === 'Enter' && newName !== company?.name && newName !== '' && error === '') {
        handleSubmit()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [newName, error])

  const handleSubmit = (): void => {
    if (company === undefined) return

    const updatedCompany: Company = {
      ...company,
      name: newName
    }

    axios.put(`${process.env.REACT_APP_SERVER_URL}/companies/${company.id}`, updatedCompany).then(() => {
      toast.success(`${company.name} updated (id: ${company.id})`)
      handleClose(true)
    }).catch((err) => toast.error(err.message))
  }

  return (
        <>
            <div className="fixed w-full min-h-screen z-30 top-0 left-0 bg-black/90 flex items-center justify-center"
                 onClick={handleEditClose}>
                <div className="bg-neutral-900 w-1/2 z-40 rounded-md overflow-hidden flex flex-col gap-2"
                     onClick={(e) => e.stopPropagation()}>
                    {company && (
                        <div className="flex flex-col gap-3 p-4">
                            <h2 className="font-bold text-lg text-white w-full border-b border-neutral-700 pb-1">Edit {company.name}</h2>
                            <div className="flex flex-col gap-y-4 text-white pr-8">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                                    <div className="relative flex items-center">
                                        <input type="text" name="name" id="name" placeholder={company.name}
                                               value={newName}
                                               onChange={(e) => setNewName(e.target.value)}
                                               className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                        {newName !== company.name && (
                                            <div className="absolute -right-8">
                                                <ArrowUturnLeftIcon onClick={() => setNewName(company.name)}
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
                                disabled={company?.name === newName || newName === '' || error !== ''}
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

export default EditCompanyModal
