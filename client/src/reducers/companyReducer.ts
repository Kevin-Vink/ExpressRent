import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Company } from '../../../common/models/company'
import axios from 'axios'

export interface companiesInitialState {
  companies: Company[]
  loading: boolean
}

const initialState: companiesInitialState = {
  companies: [],
  loading: false
}

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/companies')
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
        state.loading = false
      })
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true
      })
      .addCase(generateCompanies.fulfilled, (state, action) => {
        state.companies = action.payload
        state.loading = false
      }).addCase(generateCompanies.pending, (state) => {
        state.loading = true
      })
  }
})

export const { setCompanies } = companiesSlice.actions
export default companiesSlice.reducer
