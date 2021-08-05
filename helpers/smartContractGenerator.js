const bcrypt = require('bcrypt');

const smartContractGenerator = async (diplomaId) => {
  const hash = await bcrypt.hash(diplomaId, 5);
  return `https://reveal/smart-contract/${hash}.com`;
}

module.exports = smartContractGenerator;