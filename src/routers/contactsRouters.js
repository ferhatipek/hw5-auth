import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updatePutContactController,
  updataPatchContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  createValidateScheme,
  updateValidateScheme,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getAllContactsController));

contactRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactRouter.post('/', ctrlWrapper(createContactController));
contactRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
contactRouter.put('/:contactId', ctrlWrapper(updatePutContactController));
contactRouter.patch('/:contactId', ctrlWrapper(updataPatchContactController));

export default contactRouter;
