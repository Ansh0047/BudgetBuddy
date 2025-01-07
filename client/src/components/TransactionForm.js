import React, {useState, useEffect} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addTransaction, updateTransaction, transactionActions } from "../store/transactionSlice";
import { useDispatch, useSelector } from "react-redux";

const initialForm = {
  amount: "",
  description: "",
  date: null,
};

const TransactionForm = () => {
  const [formFields, setFormFields] = useState(initialForm)

  const dispatch = useDispatch();

  const existingTransaction = useSelector(state => state.transaction.existingTransaction)
  
  useEffect(() => {
    if(existingTransaction) {
      setFormFields({...existingTransaction})
    }

  }, [existingTransaction])
  

  const handleChange = (event) => {
    setFormFields({...formFields, [event.target.name]: event.target.value})
  };

  const handleDate = (newValue) => {
    setFormFields({ ...formFields, date: newValue });
  };

  const formSubmitHandler =  (event) => {
    event.preventDefault();

    if(!existingTransaction) {
      dispatch(addTransaction(formFields))
    }
    else {
      // async call to updateAPI.
      dispatch(updateTransaction({transaction: formFields, transactionId: existingTransaction._id}))

      dispatch(transactionActions.setExistingTransaction({existingTransaction: null}))
    }

    setFormFields(initialForm)
  };

  return (
    <div>
      <Card sx={{ minWidth: 275, marginTop: 15 }}>
        <CardContent>
          <Typography variant="h6">
            Add new transaction
          </Typography>
          <form method="POST" onSubmit={formSubmitHandler}>
            <TextField
              sx={{ marginRight: 5 }}
              type="number"
              id="outlined-basic"
              label="Amount"
              name="amount"
              value={formFields.amount}
              onChange={handleChange}
              variant="outlined"
              size="small"
            />
            <TextField
              sx={{ marginRight: 5 }}
              onChange={handleChange}
              id="outlined-basic"
              label="Description"
              name="description"
              value={formFields.description}
              size="small"
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Transaction Date"
                inputFormat="MM/DD/YYYY"
                name="date"
                value={formFields.date}
                onChange={handleDate}
                renderInput={(params) => (
                  <TextField sx={{ marginRight: 5 }} size="small" {...params} />
                )}
              />
            </LocalizationProvider>
            <Button
              size="medium"
              type="submit"
              variant="contained"
              sx={{ marginX: 2 }}
            >
              Submit
            </Button>
            { existingTransaction && <Button
              size="medium"
              type="submit"
              color="success"
              variant="contained"
              sx={{ marginX: 2 }}
            >
              Add instead
            </Button>}

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
