export type TPaymentStatus = 'Paid' | 'Unpaid' | 'Partial';

export const PaymentStatus: TPaymentStatus[] = ['Paid', 'Unpaid', 'Partial'];

export type TPaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank';

export const PaymentMethod: TPaymentMethod[] = [
  'cash',
  'bkash',
  'nagad',
  'bank',
];
