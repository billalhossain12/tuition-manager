import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentIntoDB(
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment is created succesfully',
    data: result,
  });
});

const getPayments = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await PaymentServices.getStudentPaymentsFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments are retrieved succesfully',
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  getPayments,
};
