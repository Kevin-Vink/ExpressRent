import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Customer } from '../../../common/types'
import axios from 'axios'

export interface customersInitialState {
  customers: Customer[]
}

const initialState: customersInitialState = {
  customers: []
}

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/customers')
    return response.data
  }
)

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: number) => {
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL + '/customers/' + id)
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
      })
      .addCase(generateCustomers.fulfilled, (state, action) => {
        state.customers = action.payload
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = action.payload
      })
  }
})

export const { setCustomers } = customersSlice.actions
export default customersSlice.reducer
