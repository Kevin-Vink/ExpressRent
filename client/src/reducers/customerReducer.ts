import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Customer } from '../models/customer'
import axios from 'axios'

export interface customersInitialState {
  customers: Customer[]
  loading: boolean
}

const initialState: customersInitialState = {
  customers: [],
  loading: false
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/customers')
    return response.data
  }
)

export const generateCustomers = createAsyncThunk(
  'customers/generateCustomers',
  async (amount: number) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/customers/generate', { amount })
    return response.data
  }
)

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.customers = action.payload
        state.loading = false
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
      })
      .addCase(generateCustomers.fulfilled, (state, action) => {
        state.customers = action.payload
        state.loading = false
      }).addCase(generateCustomers.pending, (state) => {
        state.loading = true
      })
  }
})

export const { setCustomers } = customersSlice.actions
export default customersSlice.reducer
