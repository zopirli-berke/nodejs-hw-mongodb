import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const countPromise = ContactsCollection.countDocuments(filter);

  const contactsPromise = ContactsCollection.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const [contactsCount, contacts] = await Promise.all([
    countPromise,
    contactsPromise,
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
    },
  );

  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);
  return contact;
};
