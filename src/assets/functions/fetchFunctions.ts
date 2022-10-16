import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';

// function handleFetchFunction (to be used for any call of fetchFunction)
export const newFetchFunction =
  async (
    collectionName: string,
    userId: string,
    month?: Date,
    limitDocs?: number,
  ) => {
    // get collectionPath
    const collectionPath = getCollectionPath(collectionName, userId);
    // get fieldToBeOrdered and orderDirection according to collection name
    const [fieldToBeOrdered, orderDirection] = getOrderConfig(collectionName);
    // get queries by first and last day of month
    let queries;
    if (month) {
      const { firstDay, lastDay } = getFormatDate(month);
      queries = getQueries(firstDay, lastDay);
    }

    // const response = await fetchFunction(collectionPath, orderByField, orderByDirection, queries);
    const response = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection, queries, limitDocs);
    return response;
  };

// helper functions
const getCollectionPath = (collectionName: string, userId: string) => {
  let collectionPath;
  if (collectionName === 'categories') {
    collectionPath = 'basicCategories';
  } else if (collectionName === 'transactions') {
    collectionPath = `users/${userId}/${collectionName}`;
  } else {
    throw Error('Missing/wrong collection name');
  }

  return collectionPath;
};

const getFormatDate = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month);
  const lastDay = new Date(year, month + 1, 0);

  return { firstDay, lastDay };
};

const getOrderConfig = (collectionName: string) => {
  let fieldToBeOrdered, orderDirection;

  if (collectionName === 'categories') {
    fieldToBeOrdered = 'value';
    orderDirection = 'asc';
  } else if (collectionName === 'transactions') {
    fieldToBeOrdered = 'date';
    orderDirection = 'desc';
  } else {
    throw Error('Missing/wrong collection name');
  }

  return [fieldToBeOrdered, orderDirection];
};

const getQueries = (firstDay: Date, lastDay: Date) => {
  const queries = [];
  queries.push({
    field: 'date',
    condition: '>=',
    value: firstDay
  });
  queries.push({
    field: 'date',
    condition: '<=',
    value: lastDay
  });
  return queries;
};