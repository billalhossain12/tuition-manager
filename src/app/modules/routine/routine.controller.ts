import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoutineServices } from './routine.service';

const createMyRoutineIntoDB = catchAsync(async (req, res) => {
  const result = await RoutineServices.createMyRoutineIntoDB(
    req.user.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Routine is created succesfully',
    data: result,
  });
});

const getMySingleRoutine = catchAsync(async (req, res) => {
  const { routineId } = req.params;
  const result = await RoutineServices.getMySingleRoutineFromDB(
    routineId,
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Routine is retrieved succesfully',
    data: result,
  });
});

const getMyAllRoutines = catchAsync(async (req, res) => {
  const result = await RoutineServices.getMyAllRoutinesFromDB(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Routines are retrieved succesfully',
    data: result,
  });
});

const updateMyRoutine = catchAsync(async (req, res) => {
  const { routineId } = req.params;
  const result = await RoutineServices.updateMyRoutineIntoDB(
    routineId,
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Routine is updated succesfully',
    data: result,
  });
});

const deleteMyRoutine = catchAsync(async (req, res) => {
  const { routineId } = req.params;
  const result = await RoutineServices.deleteMyRoutineFromDB(
    routineId,
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Routine is deleted succesfully',
    data: result,
  });
});

export const RoutineControllers = {
  createMyRoutineIntoDB,
  getMyAllRoutines,
  getMySingleRoutine,
  deleteMyRoutine,
  updateMyRoutine,
};
