import React, { type FunctionComponent, useEffect, useState } from 'react'
import { type Car } from '../../../../../common/types'
import CustomCreatableSelect from './../../CustomCreatableSelect'
import { type RootState, useAppDispatch, useAppSelector } from '../../../store/store'
import { fetchCompanies } from '../../../reducers/companyReducer'
import { toast } from 'react-toastify'
import { ChromePicker } from 'react-color'
import ConfirmationModal from './../ConfirmationModal'
import axios from 'axios'

interface Props {
  handleClose: (update: boolean) => void
}

const CreateCarModal: FunctionComponent<Props> = (props: Props) => {
  const {
    handleClose
  } = props

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)

  const { companies } = useAppSelector((state: RootState) => state.companies)
  const dispatch = useAppDispatch()

  const [name, setName] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [color, setColor] = useState<string>('102030')
  const [year, setYear] = useState<string>(new Date().toISOString().slice(0, 7))
  const [dailyRate, setDailyRate] = useState<number>(0)
  const [companyId, setCompanyId] = useState<number | undefined>(0)

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleEditClose()
      }
      if (e.key === 'Enter' && name !== '' && type !== '' && color !== '' && year <= new Date().getFullYear().toString() && dailyRate >= 0 && companyId !== 0) {
        handleSubmit()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [name, type, color, year, companyId])

  useEffect(() => {
    if (companies.length === 0) dispatch(fetchCompanies()).catch((err) => toast.error(err.message))
  }, [])

  const handleEditClose = (): void => {
    if (name !== '' || type !== '' || color !== '102030' || companyId !== 0) {
      setShowConfirmationModal(true)
    } else {
      handleClose(false)
    }
  }

  const handleSubmit = (): void => {
    const formattedYear = new Date(year).getFullYear()

    const newCar: Car = {
      name,
      type,
      color,
      year: formattedYear,
      dailyRate,
      company: {
        id: companyId,
        name: companies.find((company) => company.id === companyId)?.name ?? ''
      }
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/cars`, newCar).then(() => {
      toast.success(`Created ${newCar.name}!`)
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
                            <h2 className="font-bold text-lg text-white w-full border-b border-neutral-700 pb-1">Create a new car</h2>
                            <div className='text-white grid grid-cols-2 gap-16'>
                                <div className="flex flex-col gap-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                                        <div className="relative flex items-center capitalize">
                                            <input type="text" name="name" id="name" placeholder="Name"
                                                   value={name}
                                                   onChange={(e) => setName(e.target.value)}
                                                   className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="dailyRate">Daily Rate <span
                                            className="text-red-500">*</span></label>
                                        <div className="relative flex items-center">
                                            <input type="number" step="0.01" name="dailyRate" id="dailyRate"
                                                   placeholder="Daily Rate"
                                                   value={dailyRate}
                                                   onChange={(e) => setDailyRate(parseFloat(e.target.value))}
                                                   className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="type">Type <span className="text-red-500">*</span></label>
                                        <CustomCreatableSelect type={type} newType={type}
                                                               setNewType={setType}/>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="year">Year <span className="text-red-500">*</span></label>
                                        <div className="relative flex items-center">
                                            <input type="month" name="year" id="year"
                                                   value={year}
                                                   onChange={(e) => {
                                                     setYear(e.target.value)
                                                   }}
                                                   className="p-2 bg-neutral-800 w-full rounded-md placeholder:text-neutral-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="company">Company <span className="text-red-500">*</span></label>
                                        <div className="relative flex items-center">
                                            <select name="company" id="company"
                                                    value={companyId} onChange={(e) => {
                                                      setCompanyId(parseInt((e.target.value)))
                                                    }}
                                                    className="p-2 bg-neutral-800 w-full rounded-md placeholder:text-neutral-400"
                                            >
                                                <option disabled value='0'>Select a company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>{company.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex justify-between">
                                        <p>Color <span className="text-red-500">*</span></p>
                                    </div>
                                    <div className="w-full h-3 rounded-full"
                                         style={{ backgroundColor: `#${color}` }}/>
                                    <ChromePicker className="!w-full !bg-transparent !shadow-none !text-white"
                                                  color={`#${color}`} onChange={(color) => {
                                                    setColor(color.hex.slice(1))
                                                  }}/>
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
                                disabled={name === '' || type === '' || color === '' || year === '' || dailyRate <= 0 || companyId === 0}
                                className="inline-flex disabled:bg-neutral-500 w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 sm:ml-3 sm:w-auto">Create
                            Car
                        </button>
                    </div>
                </div>
            </div>
            {showConfirmationModal &&
                <ConfirmationModal handleConfirm={() => handleClose(false)} handleClose={() => setShowConfirmationModal(false)}/>}
        </>
  )
}

export default CreateCarModal
