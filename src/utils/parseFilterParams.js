const parseContactType = (type) => {
  const isKnownType = ['work', 'home', 'personal'].includes(type);
  if (isKnownType) return type;
};

const parseIsFavorite = (isFavorite) => {
  const isBooleanString = ['true', 'false'].includes(isFavorite);
  if (isBooleanString) return isFavorite === 'true';
};

export const parseFilterParams = (query) => {
  const { contactType, isFavorite, name } = query;

  const filter = {};

  const parsedContactType = parseContactType(contactType);
  if (parsedContactType) {
    filter.contactType = parsedContactType;
  }

  const parsedIsFavorite = parseIsFavorite(isFavorite);
  if (parsedIsFavorite !== undefined) {
    filter.isFavorite = parsedIsFavorite;
  }

  if (typeof name === 'string' && name.length > 0) {
    filter.name = { $regex: name, $options: 'i' };
  }

  return filter;
};
