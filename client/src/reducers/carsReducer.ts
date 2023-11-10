import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Car } from '../../../common/types'
import axios from 'axios'

export interface carsInitialState {
  cars: Car[]
  loading: boolean
}

const initialState: carsInitialState = {
  cars: [],
  loading: false
}

export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/cars')
    return response.data
  }
)

export const generateCars = createAsyncThunk(
  'cars/generateCars',
  async (amount: number) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/cars/generate', { amount })
    return response.data
  }
)

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id: number) => {
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL + '/cars/' + id)
    return response.data
  }
)

export const deleteAllCars = createAsyncThunk(
  'cars/deleteAllCars',
  async () => {
    const response = await axios.delete(process.env.REACT_APP_SERVER_URL + '/cars')
    return response.data
  }
)

export const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCars: (state, action: PayloadAction<Car[]>) => {
      state.cars = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload
        state.loading = false
      })
      .addCase(fetchCars.pending, (state) => {
        state.loading = true
      })
      .addCase(generateCars.fulfilled, (state, action) => {
        state.cars = action.payload
        state.loading = false
      })
      .addCase(generateCars.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = action.payload
        state.loading = false
      })
      .addCase(deleteCar.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteAllCars.fulfilled, (state, action) => {
        state.cars = action.payload
        state.loading = false
      })
      .addCase(deleteAllCars.pending, (state) => {
        state.loading = true
      })
  }
})

export const { setCars } = carsSlice.actions
export default carsSlice.reducer
