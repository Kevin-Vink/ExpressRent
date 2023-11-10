import React, { type FunctionComponent, useEffect, useState } from 'react'
import { type Car } from '../../../../../common/types'
import CustomCreatableSelect from '../../CustomCreatableSelect'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { type RootState, useAppDispatch, useAppSelector } from '../../../store/store'
import { fetchCompanies } from '../../../reducers/companyReducer'
import { toast } from 'react-toastify'
import { ChromePicker } from 'react-color'
import ConfirmationModal from './../ConfirmationModal'
import axios from 'axios'

interface Props {
  car: Car | undefined
  handleClose: (update: boolean) => void
}

const EditCarModal: FunctionComponent<Props> = (props: Props) => {
  const {
    car,
    handleClose
  } = props

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)

  const { companies } = useAppSelector((state: RootState) => state.companies)
  const dispatch = useAppDispatch()

  const [newName, setNewName] = useState<string>('')
  const [newType, setNewType] = useState<string>('')
  const [newColor, setNewColor] = useState<string>('')
  const [newYear, setNewYear] = useState<string>('')
  const [newDailyRate, setNewDailyRate] = useState<number>(0)
  const [newCompanyId, setNewCompanyId] = useState<number | undefined>(0)

  useEffect(() => {
    setNewName(car?.name ?? '')
    setNewType(car?.type ?? '')
    setNewColor(car?.color ?? '')
    setNewYear(`${car?.year.toString()}-01` ?? '')
    setNewDailyRate(car?.dailyRate ?? 0)
    setNewCompanyId(car?.company.id ?? 0)
  }, [car])

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleEditClose()
      }
      if (e.key === 'Enter' && newName !== '' && newType !== '' && newColor !== '' && newYear !== '' && newCompanyId !== 0 &&
                newName !== car?.name || newType !== car?.type || newColor !== car?.color || newYear !== `${car?.year.toString()}-01` || newCompanyId !== car?.company.id) {
        handleSubmit()
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    return () => document.removeEventListener('keydown', keyDownHandler)
  }, [newName, newType, newColor, newYear, newCompanyId])

  useEffect(() => {
    if (companies.length === 0) dispatch(fetchCompanies()).catch((err) => toast.error(err.message))
  }, [])

  const handleEditClose = (): void => {
    if (newName !== car?.name || newType !== car?.type || newColor !== car?.color || newYear !== `${car?.year.toString()}-01` || car.dailyRate !== newDailyRate || newCompanyId !== car?.company.id) {
      setShowConfirmationModal(true)
    } else {
      handleClose(false)
    }
  }

  const handleSubmit = (): void => {
    if (car === undefined) return

    const formattedYear = new Date(newYear).getFullYear()

    const newCar: Car = {
      name: newName || car.name,
      type: newType || car.type,
      color: newColor || car.color,
      year: formattedYear || car.year,
      dailyRate: newDailyRate ?? car.dailyRate,
      company: {
        id: newCompanyId ?? car.company.id,
        name: companies.find((company) => company.id === newCompanyId)?.name ?? car.company.name
      }
    }

    axios.put(`${process.env.REACT_APP_SERVER_URL}/cars/${car.id}`, newCar).then(() => {
      toast.success(`${newCar.name} updated (id: ${car.id})`)
      handleClose(true)
    }).catch((err) => toast.error(err.message))
  }

  return (
        <>
            <div className="fixed w-full min-h-screen z-30 top-0 left-0 bg-black/90 flex items-center justify-center"
                 onClick={handleEditClose}>
                <div className="bg-neutral-900 w-1/2 z-40 rounded-md overflow-hidden flex flex-col gap-2"
                     onClick={(e) => e.stopPropagation()}>
                    {car && (
                        <div className="flex flex-col gap-3 p-4">
                            <h2 className="font-bold text-lg text-white w-full border-b border-neutral-700 pb-1">Edit {car.name}</h2>
                            <div className='text-white grid grid-cols-2 gap-16'>
                              <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col gap-1">
                                  <label htmlFor="name">Name <span className="text-red-500">*</span></label>
                                  <div className="relative flex items-center">
                                    <input type="text" name="name" id="name" placeholder={car.name}
                                           value={newName}
                                           onChange={(e) => setNewName(e.target.value)}
                                           className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                    {newName !== car.name && (
                                        <div className="absolute -right-8">
                                          <ArrowUturnLeftIcon onClick={() => setNewName(car.name)}
                                                              className="w-5 text-red-500 h-auto"/>
                                        </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label htmlFor="dailyRate">Daily Rate <span className="text-red-500">*</span></label>
                                  <div className="relative flex items-center">
                                    <input type="number" step="0.01" name="dailyRate" id="dailyRate" placeholder={car.dailyRate.toString()}
                                           value={newDailyRate}
                                           onChange={(e) => setNewDailyRate(parseFloat(e.target.value))}
                                           className="p-2 w-full bg-neutral-800 rounded-md placeholder:text-neutral-400"/>
                                    {newDailyRate !== car.dailyRate && (
                                        <div className="absolute -right-8">
                                          <ArrowUturnLeftIcon onClick={() => setNewDailyRate(car?.dailyRate)}
                                                              className="w-5 text-red-500 h-auto"/>
                                        </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label htmlFor="type">Type <span className="text-red-500">*</span></label>
                                  <CustomCreatableSelect type={car.type} newType={newType}
                                                         setNewType={setNewType}/>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label htmlFor="year">Year <span className="text-red-500">*</span></label>
                                  <div className="relative flex items-center">
                                    <input type="month" name="year" id="year"
                                           value={newYear || `${car.year}-01`}
                                           placeholder={car.year.toString()}
                                           onChange={(e) => {
                                             setNewYear(e.target.value)
                                           }}
                                           className="p-2 bg-neutral-800 w-full rounded-md placeholder:text-neutral-400"
                                    />
                                    {newYear !== `${car.year}-01` && (
                                        <div className="absolute -right-8">
                                          <ArrowUturnLeftIcon onClick={() => setNewYear(`${car.year}-01`)}
                                                              className="w-5 text-red-500 h-auto"/>
                                        </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label htmlFor="company">Company <span className="text-red-500">*</span></label>
                                  <div className="relative flex items-center">
                                    <select name="company" id="company"
                                            value={newCompanyId ?? car.company.id} onChange={(e) => {
                                              setNewCompanyId(parseInt((e.target.value)))
                                            }}
                                            className="p-2 bg-neutral-800 w-full rounded-md placeholder:text-neutral-400"
                                    >
                                      {companies.map((company) => (
                                          <option key={company.id} value={company.id}>{company.name}</option>
                                      ))}
                                    </select>
                                    {newCompanyId !== car.company.id && (
                                        <div className="absolute -right-8">
                                          <ArrowUturnLeftIcon onClick={() => setNewCompanyId(car?.company.id)}
                                                              className="w-5 text-red-500 h-auto"/>
                                        </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="w-full flex justify-between">
                                  <p>Color <span className="text-red-500">*</span></p>
                                  {newColor !== car.color && (
                                      <ArrowUturnLeftIcon onClick={() => setNewColor(car?.color)}
                                                          className="w-5 text-red-500 h-auto"/>
                                  )}
                                </div>
                                <div className="w-full h-3 rounded-full"
                                     style={{ backgroundColor: `#${newColor || car.color}` }}/>
                                <ChromePicker className="!w-full !bg-transparent !shadow-none !text-white"
                                              color={`#${newColor || car.color}`} onChange={(color) => {
                                                setNewColor(color.hex.slice(1))
                                              }}/>
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
                                disabled={car?.color === newColor && car?.type === newType && car?.name === newName && newYear === `${car.year}-01` && car?.company.id === newCompanyId && car.dailyRate === newDailyRate || newDailyRate <= 0 || newName === ''}
                                className="inline-flex disabled:bg-neutral-500 w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 sm:ml-3 sm:w-auto">Save
                            Changes
                        </button>
                    </div>
                </div>
            </div>
            {showConfirmationModal &&
                <ConfirmationModal handleConfirm={() => handleClose(false)} handleClose={() => setShowConfirmationModal(false)}/>}
        </>
  )
}

export default EditCarModal
