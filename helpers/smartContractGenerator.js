const bcrypt = require('bcrypt');

const smartContractGenerator = async (studentId, diplomaId) => {
  const hash = await bcrypt.hash(studentId + diplomaId, 5);
  return `https://reveal/smart-contract/${hash}.com`;
}

module.exports = smartContractGenerator;