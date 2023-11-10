import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Rental } from '../../../common/types'
import axios from 'axios'

export interface rentalsInitialState {
  rentals: Rental[]
  loading: boolean
}

const initialState: rentalsInitialState = {
  rentals: [],
  loading: false
}

export const fetchRentals = createAsyncThunk(
  'rentals/fetchRentals',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/rentals')
    return response.data
  }
)

export const generateRentals = createAsyncThunk(
  'rentals/generateRentals',
  async (amount: number) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/rentals/generate', { amount })
    return response.data
  }
)

export const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    setRentals: (state, action: PayloadAction<Rental[]>) => {
      state.rentals = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentals.fulfilled, (state, action) => {
        state.rentals = action.payload
        state.loading = false
      })
      .addCase(fetchRentals.pending, (state) => {
        state.loading = true
      })
      .addCase(generateRentals.fulfilled, (state, action) => {
        state.rentals = action.payload
        state.loading = false
      })
      .addCase(generateRentals.pending, (state) => {
        state.loading = true
      })
  }
})

export const { setRentals } = rentalsSlice.actions
export default rentalsSlice.reducer
