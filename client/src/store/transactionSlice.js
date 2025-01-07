import { createSlice } from "@reduxjs/toolkit";
import { authActions } from "./authSlice";
import Cookies from "js-cookie";

const initialState = {
  transactions: [],
  existingTransaction: null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    replaceTransactions(state, action) {
      state.transactions = action.payload.transactions;
    },
    setExistingTransaction(state, action) {
      state.existingTransaction = action.payload.existingTransaction;
    }
  },
});

const fetchDataFromServer = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${Cookies.get('auth-token')}`,
    },
  });

  if (!response.ok) {
    throw new Error({ message: "Couldn't fetch data" });
  }

  const data = await response.json();
  return data;
};

export const fetchTransactions = () => {
  return async (dispatch) => {
    try {
      const data = await fetchDataFromServer();
      dispatch(
        transactionActions.replaceTransactions({
          transactions: data.transactions || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const addTransaction = (transaction) => {
  return async (dispatch) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction`,
      {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${Cookies.get('auth-token')}`,
        },
      }
    );

    if (!response.ok) {
      if(response.status === 401) {
        console.log("unauthorized")
        dispatch(authActions.logoutSuccess());
      }
      console.log("could not add transaction");
      return;
    }

    try {
      const data = await fetchDataFromServer();
      dispatch(
        transactionActions.replaceTransactions({
          transactions: data.transactions || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateTransaction = ({transaction, transactionId}) => {
  return async (dispatch) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${transactionId}`,
      {
        method: "PATCH",
        body: JSON.stringify(transaction),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${Cookies.get('auth-token')}`,
        },
      }
    );

    if (!response.ok) {
      if(response.status === 401) {
        console.log("unauthorized")
        dispatch(authActions.logoutSuccess());
      }
      console.log("could not update transaction");
      return;
    }

    try {
      const data = await fetchDataFromServer();
      dispatch(
        transactionActions.replaceTransactions({
          transactions: data.transactions || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteTransaction = (transactionId) => {
  return async (dispatch) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/transaction/${transactionId}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${Cookies.get('auth-token')}`,
        },
      }
    );

    if (!response.ok) {
      if(response.status === 401) {
        console.log("unauthorized")
        dispatch(authActions.logoutSuccess());
      }
      console.log("could not delete transaction");
      return;
    }

    try {
      const data = await fetchDataFromServer();
      dispatch(
        transactionActions.replaceTransactions({
          transactions: data.transactions || [],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
};

export const transactionActions = transactionSlice.actions;

export default transactionSlice.reducer;
