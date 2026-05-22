import { Transaction } from "@/types/common";

export const getTransactionReference = (transaction: Transaction) =>
  transaction.data?.transactionKey ||
  transaction.transactionKey ||
  transaction.id ||
  "N/A";

export const getTransactionAmount = (transaction: Transaction) =>
  transaction.amount ??
  transaction.data?.transactionAmount ??
  transaction.transactionAmount ??
  0;

export const getSourceAccount = (transaction: Transaction) =>
  transaction.data?.accountNumber ||
  transaction.accountNumber ||
  transaction.debitAccount ||
  "N/A";

export const getBeneficiaryAccount = (transaction: Transaction) =>
  transaction.creditAccount ||
  transaction.data?.beneficiaryAccount ||
  transaction.beneficiaryAccount ||
  "N/A";

export const getTransactionTimestamp = (transaction: Transaction) =>
  transaction.data?.activationDate ||
  transaction.activationDate ||
  transaction.transactionTimeStamp ||
  null;

export const getTransactionStatus = (transaction: Transaction) =>
  transaction.status || transaction.transactionStatus || "N/A";
