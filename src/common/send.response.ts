import { Response } from 'express';
import { DataObject } from '../interfaces/response.data.object';

export default function sendResponse(res: Response, dataObject: DataObject) {
  return res.status(dataObject.status_code).json(dataObject.data ? { data: dataObject.data } : {});
}
