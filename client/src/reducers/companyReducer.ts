import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Company } from '../../../common/types'
import axios from 'axios'

export interface companiesInitialState {
  companies: Company[]
}

const initialState: companiesInitialState = {
  companies: []
}

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/companies')
    return response.data
  }
)

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: number) => {
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL + '/companies/' + id)
    return response.data
  }
)

export const generateCompanies = createAsyncThunk(
  'companies/generateCompanies',
  async (amount: number) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/companies/generate', { amount })
    return response.data
  }
)

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload
      })
      .addCase(generateCompanies.fulfilled, (state, action) => {
        state.companies = action.payload
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = action.payload
      })
  }
})

export const { setCompanies } = companiesSlice.actions
export default companiesSlice.reducer
