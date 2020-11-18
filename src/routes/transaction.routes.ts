import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;
    const { total } = transactionsRepository.getBalance();

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    if (type === 'outcome' && value > total)
      throw new Error('O valor de saída não pode ser superior ao saldo atual.');

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
