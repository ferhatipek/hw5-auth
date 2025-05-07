import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import e from 'cors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact with id ${contactId} not found!`);
  }

  res.status(200).json({
    message: `Successfully found contact with id: ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = req.body;

  const createdContact = await createContact(newContact);

  res.status(201).json({
    message: 'Successfully created contact!',
    status: 201,
    data: createdContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw createHttpError(404, `Contact with id not found!`);
  }

  res.status(200).send({
    message: 'Successfully deleted contact!',
    status: 200,
    data: contact,
  });
};
export const updatePutContactController = async (req, res) => {
  const { contactId } = req.params;
  const newFields = req.body;

  const updatedContact = await updateContact(contactId, newFields, {
    upsert: true,
  });

  if (!updatedContact) {
    throw createHttpError(404, `Contact  not found!`);
  }

  const status = updatedContact.isNew ? 201 : 200;
  const message = updatedContact.isNew
    ? 'Successfully created contact!'
    : 'Successfully updated contact!';

  res.status(status).send({
    message: message,
    status: status,
    data: updatedContact.contact,
  });
};

export const updataPatchContactController = async (req, res) => {
  const { contactId } = req.params;
  const newFields = req.body;

  const updatedContact = await updateContact(contactId, newFields, {
    upsert: false,
  });

  if (!updatedContact) {
    throw createHttpError(404, `Contact with id not found!`);
  }

  res.status(200).json({
    message: `Successfully updated contact!`,
    status: 200,
    data: updatedContact.contact,
  });
};
