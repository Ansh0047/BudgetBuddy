import React from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionsList from "../components/TransactionList";
import { Container } from "@mui/system";

const Home = () => {
  return (
    <Container>
      <TransactionForm />
      <TransactionsList />
    </Container>
  );
};

export default Home;
