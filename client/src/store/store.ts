import { configureStore } from '@reduxjs/toolkit'
import carsReducer from '../reducers/carsReducer'
import rentalsReducer from '../reducers/rentalsReducer'
import customerReducer from '../reducers/customerReducer'
import companyReducer from '../reducers/companyReducer'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const store = configureStore({
  reducer: {
    cars: carsReducer,
    rentals: rentalsReducer,
    customers: customerReducer,
    companies: companyReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
