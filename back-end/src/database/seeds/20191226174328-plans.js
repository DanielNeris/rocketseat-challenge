module.exports = {
  up: QueryInterface =>
    QueryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Start',
          duration: 1,
          price: 150000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          title: 'Gold',
          duration: 3,
          price: 120000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          title: 'Diamond',
          duration: 6,
          price: 90000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {}
    ),

  down: () => {},
};
