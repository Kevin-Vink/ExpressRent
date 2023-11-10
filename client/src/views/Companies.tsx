import React, { type FunctionComponent, type ReactElement, useEffect, useState } from 'react'
import { type Company } from '../../../common/types'
import { toast } from 'react-toastify'
import { useAppDispatch } from '../store/store'
import axios from 'axios'
import { deleteCompany, generateCompanies } from '../reducers/companyReducer'
import EditCompanyModal from '../components/modals/company/EditCompanyModal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CreateCompanyModal from '../components/modals/company/CreateCompanyModal'

const Companies: FunctionComponent = () => {
  const dispatch = useAppDispatch()

  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<Company>()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [companiesToGenerate, setCompaniesToGenerate] = useState<number>(5)
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isLoading) setIsLoading(true)
    const timeout = setTimeout(() => {
      handleFilter(searchTerm).catch((err) => toast.error(err.message))
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  const searchCompanies = async (searchTerm: string = ''): Promise<Company[]> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/companies/search?q=${searchTerm}`)
    return res.data
  }

  const deleteAction = (id: number | undefined, name: string): void => {
    if (id != null) {
      dispatch(deleteCompany(id)).then(async () => {
        setIsLoading(true)
        await handleFilter(searchTerm)
        toast.success(`${name} deleted`)
      }).catch((err) => toast.error(err.message))
    }
  }

  const generateCompaniesAction = (e: React.MouseEvent): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const target: any = e.target.tagName
    if (target.toLowerCase() === 'select') return
    dispatch(generateCompanies(companiesToGenerate)).then(async () => {
      setIsLoading(true)
      await handleFilter(searchTerm)
      toast.success(`${companiesToGenerate} New companies generated`)
    }).catch((err) => toast.error(err.message))
  }

  const handleFilter = async (keyword: string): Promise<void> => {
    setSearchTerm(keyword)

    searchCompanies(keyword).then((res) => {
      setFilteredCompanies(res)
    }).catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false))
  }

  const handleEditCompany = (company: Company): void => {
    setSelectedCompany(company)
    setShowEditModal(true)
  }

  const handleCloseEditModal = (update: boolean = false): void => {
    setSelectedCompany(undefined)
    setShowEditModal(false)
    if (update) handleFilter(searchTerm).catch((err) => toast.error(err.message))
  }

  const handleCloseCreateModal = (update: boolean = false): void => {
    setShowCreateModal(false)
    if (update) handleFilter(searchTerm).catch((err) => toast.error(err.message))
  }

  const selectComponent = (): ReactElement => {
    return (
            <select className="z-30 bg-transparent text-center" name="amount" id="amount"
                    onChange={(e) => setCompaniesToGenerate(parseInt(e.target.value))}>
                {Array.from(Array(10).keys()).map((i) => (
                    <option key={(i + 1) * 5} value={(i + 1) * 5}>{(i + 1) * 5}</option>
                ))}
            </select>
    )
  }

  return (
        <>
          <div className="text-white bg-neutral-900 p-4 w-full h-full flex flex-col gap-4 min-h-screen">
            <div className='flex gap-x-2'>
              <input className="bg-stone-600 rounded-full px-4" type="text" placeholder="Search" id="search"
                     value={searchTerm}
                     name="search" onChange={(e) => {
                       setSearchTerm(e.target.value)
                     }}/>
              <p>{filteredCompanies.length} companies</p>
              <span
                  className="bg-stone-600 z-10 cursor-pointer hover:bg-green-500 transition-all rounded-full px-4"
                  onClick={(e) => generateCompaniesAction(e)}>
                    Generate {selectComponent()} Companies
                    </span>
              <button className="bg-stone-600 hover:bg-blue-500 transition-all rounded-full px-4"
                      onClick={() => setShowCreateModal(true)}>Create Company
              </button>
            </div>
              {searchTerm && (
                  <div className="flex w-fit py-px overflow-hidden cursor-pointer rounded-md group"
                       onClick={() => setSearchTerm('')}>
                        <span
                            className="bg-neutral-500/25 group-hover:bg-neutral-500/50 transition-all px-2 text-neutral-300 capitalize">
                            {searchTerm}
                        </span>
                    <XMarkIcon
                        className="w-6 h-full bg-red-500/25 text-red-500 group-hover:bg-red-500/30 transition-all"/>
                  </div>
              )}
            {isLoading
              ? (
                    <div className="flex flex-col gap-4 flex-1 justify-center items-center h-full">
                      <div
                          className="animate-spin z-10 rounded-full h-12 w-12 border-[5px] border-r-blue-500 border-neutral-700"/>
                      <p className="text-sm text-neutral-300">Searching For Companies</p>
                    </div>
                )
              : (
                    <div className="grid grid-cols-4 gap-4">
                      {(!isLoading && (filteredCompanies.length === 0 && searchTerm === '')) &&
                          <p>No companies in database</p>}
                      {filteredCompanies.map((company) => (
                          <div key={company.id}>
                            <p>{company.name}</p>
                            <div className="flex gap-x-2">
                              <button onClick={() => handleEditCompany(company)}
                                      className="bg-stone-600 hover:bg-blue-500 transition-all rounded-full px-4 mb-4">
                                Edit
                              </button>
                              <button
                                  className="bg-stone-600 hover:bg-red-500 transition-all rounded-full px-4 mb-4"
                                  type="button" onClick={() => {
                                    deleteAction(company.id, company.name)
                                  }}>Delete
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
          </div>
          {showEditModal && <EditCompanyModal company={selectedCompany} handleClose={handleCloseEditModal}/>}
          {showCreateModal && <CreateCompanyModal handleClose={handleCloseCreateModal}/>}
        </>
  )
}

export default Companies
