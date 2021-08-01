import { status } from '../helpers/status';

const emailFetcher = async (selectedRows) => {
  const studentsNotMailed = selectedRows.filter(student => student.status === status.not_mailed);
  console.log('notmailed: ', studentsNotMailed);
  if (studentsNotMailed){
    const resultRaw = await fetch('/emails/confirmation', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(studentsNotMailed)
    });
    const result = await resultRaw.json();
    console.log('confirm Result: ', result);
  }
  console.log('YOUPI');
};

export default emailFetcher;

