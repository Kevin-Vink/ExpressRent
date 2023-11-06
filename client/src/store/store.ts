import { configureStore } from '@reduxjs/toolkit'
import carsReducer from '../reducers/carsReducer'
import rentalsReducer from '../reducers/rentalsReducer'
import customerReducer from '../reducers/customerReducer'
import companyReducer from '../reducers/companyReducer'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { type RootState } from '@reduxjs/toolkit/query'

const store = configureStore({
  reducer: {
    cars: carsReducer,
    rentals: rentalsReducer,
    customers: customerReducer,
    companies: companyReducer
  }
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState<any, any, any>> = useSelector

export default store
