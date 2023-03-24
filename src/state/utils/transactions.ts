import { IOrderConfig } from 'utils/interfaces';

export const getDateQueries = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month);
  const lastDay = new Date(year, month + 1, 0);

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

export const getOrderConfig = () => {
  const orderConfig: IOrderConfig[] = [
    {
      fieldName: 'date',
      orderDirection: 'desc'
    },
    {
      fieldName: 'publishDate',
      orderDirection: 'desc'
    },
  ];
  return orderConfig;
};
