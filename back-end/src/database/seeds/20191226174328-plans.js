module.exports = {
  up: QueryInterface =>
    QueryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Start',
          duration: 1,
          price: 15000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          title: 'Gold',
          duration: 3,
          price: 12000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          title: 'Diamond',
          duration: 6,
          price: 9000,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {}
    ),

  down: () => {},
};
