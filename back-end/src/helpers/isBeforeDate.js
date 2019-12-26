import moment from 'moment';

function checkDate(start_date) {
  return moment(start_date).isBefore(new Date());
}

export default checkDate;
