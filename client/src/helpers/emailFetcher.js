import { status } from '../helpers/status';

const emailFetcher = async (selectedRows) => {
  const diplomasNotMailed = selectedRows.filter(diploma => diploma.status === status.not_mailed);
  console.log('notmailed: ', diplomasNotMailed);
  if (diplomasNotMailed){
    const resultRaw = await fetch('/emails/confirmation', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(diplomasNotMailed)
    });
    const result = await resultRaw.json();
    console.log('confirm Result: ', result);
  }
  //console.log('end of emailfetcher');
};

export default emailFetcher;

