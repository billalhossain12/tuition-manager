import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TutorServices } from './tutor.service';

const getSingleTutor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TutorServices.getSingleTutorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tutor is retrieved succesfully',
    data: result,
  });
});

const getAllTutors = catchAsync(async (req, res) => {
  const result = await TutorServices.getAllTutorsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tutors are retrieved succesfully',
    data: result,
  });
});

const updateTutor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { tutor } = req.body;
  const result = await TutorServices.updateTutorIntoDB(id, tutor);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tutor is updated succesfully',
    data: result,
  });
});

const deleteTutor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TutorServices.deleteTutorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tutor is deleted succesfully',
    data: result,
  });
});

export const TutorControllers = {
  getAllTutors,
  getSingleTutor,
  deleteTutor,
  updateTutor,
};
