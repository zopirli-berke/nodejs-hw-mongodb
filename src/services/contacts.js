import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  filter = {},
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  ownerId,
}) => {
  const skip = (page - 1) * perPage;

  const query = { ...filter, userId: ownerId };

  const countPromise = ContactsCollection.countDocuments(query);

  const contactsPromise = ContactsCollection.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage)
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

export const getContactById = async (contactId, ownerId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: ownerId,
  });
  return contact;
};

export const createContact = async (payload, ownerId) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId: ownerId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, ownerId) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: ownerId },
    payload,
    {
      new: true,
    },
  );

  return contact;
};

export const deleteContact = async (contactId, ownerId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: ownerId,
  });
  return contact;
};
