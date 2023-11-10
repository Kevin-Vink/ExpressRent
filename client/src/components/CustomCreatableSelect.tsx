import React, { type FunctionComponent, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import axios from 'axios'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

interface TypeOption {
  label: string
  value: string
}

interface Props {
  type: string
  newType: string
  setNewType: (newType: string) => void
}

const CustomCreatableSelect: FunctionComponent<Props> = (props: Props) => {
  const [types, setTypes] = useState<TypeOption[]>([])

  const fetchTypes = async (): Promise<void> => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/cars/types`)
    const data = await res.data
    const formattedTypes = data.map((type: string) => mapToTypeOption(type))
    setTypes(formattedTypes)
  }

  useEffect(() => {
    fetchTypes().catch((err) => console.error(err))
  }, [])

  const mapToTypeOption = (type: string): TypeOption => {
    return {
      label: type,
      value: type
    }
  }

  const handleCreate = (inputValue: string): void => {
    const newOption = mapToTypeOption(inputValue)
    setTypes([...types, newOption])
    props.setNewType(newOption.value)
  }

  return (
        <div className="relative flex items-center">
            <CreatableSelect
                options={types}
                onCreateOption={handleCreate}
                className="w-full"
                value={mapToTypeOption(props.newType) || mapToTypeOption(props.type)}
                onChange={(newValue) => props.setNewType(newValue?.value ?? '')}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: '#262626',
                    color: '#a3a3a3',
                    fill: '#a3a3a3',
                    border: 'none',
                    boxShadow: 'none'
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: '#fff'
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#fff'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#262626',
                    color: '#fff'
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    backgroundColor: '#262626',
                    color: '#fff',
                    '::-webkit-scrollbar': {
                      width: '9px'
                    },
                    '::-webkit-scrollbar-track': {
                      background: '#525252'
                    },
                    '::-webkit-scrollbar-thumb': {
                      background: '#737373'
                    },
                    '::-webkit-scrollbar-thumb:hover': {
                      background: '#a9a9a9'
                    }
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#a3a3a3'
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#2463eb' : state.isFocused ? '#93c5fd' : '#262626',
                    color: state.isSelected ? '#eee' : '#fff',
                    '&:hover': {
                      backgroundColor: '#93c5fd'
                    }
                  })
                }}
            />
            {props.newType !== props.type && (
                <div className="absolute -right-8">
                    <ArrowUturnLeftIcon onClick={() => props.setNewType(props.type)} className="w-5 text-red-500 h-auto" />
                </div>
            )}
        </div>
  )
}

export default CustomCreatableSelect
