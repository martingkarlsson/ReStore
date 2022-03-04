import { RootState } from './../../app/store/configureStore';

import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from '../../app/api/agent';

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async () => {
        try {
            return agent.Catalog.list();
        } catch (error) {
            console.log(error);
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
  'catalog/fetchProductAsync',
  async (productId) => {
    try {
      return agent.Catalog.details(productId);
    } catch (error) {
      console.log(error);
    }
  }
)

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builer => {
        builer.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builer.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload)
          state.status = 'idle';
          state.productsLoaded = true;
        });
        builer.addCase(fetchProductsAsync.rejected, (state) => {
          state.status = 'idle';
        });

        builer.addCase(fetchProductAsync.pending, (state) => {
          state.status = 'pendingFetchProduct';
        });
        builer.addCase(fetchProductAsync.fulfilled, (state, action) => {
          productsAdapter.upsertOne(state, action.payload);
          state.status = 'idle';
        });
        builer.addCase(fetchProductAsync.rejected, (state) => {
          state.status = 'idle';
        });
    })

})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);