const { authOnDelete, authOnCreate } = require('./services/userTriggers')
const { sendMoney } = require('./services/sendMoney')
const { createAccount } = require('./services/createAccount')
const { verifyPhone } = require('./services/verifyPhone')
const { getUserCharities } = require('./services/getUserCharities')
const { donateWithApplePay } = require('./services/donateWithApplePay')
const { createContribution } = require('./services/createContribution')
const { onContributionWrite } = require('./services/contributionTriggers')
const { onDreamWrite } = require('./services/dreamTriggers')
const { sendDream } = require('./services/sendDream')
const { createBankAccount } = require('./services/createBankAccount')
const { deleteBankAccount } = require('./services/deleteBankAccount')
const { getBankAccount } = require('./services/getBankAccount')
const { sendProfile } = require('./services/sendProfile')
const {
  scheduleFunctionWeeklyPay
} = require('./services/scheduleFunctionWeeklyPay')
const {
  addDreamToAlgolia,
  editDreamToAlgolia,
  userToAlgoliaTrigger
} = require('./services/dreamToAlgoliaTrigger')

module.exports = {
  authOnDelete,
  authOnCreate,
  sendMoney,
  createAccount,
  deleteBankAccount,
  createBankAccount,
  getBankAccount,
  verifyPhone,
  getUserCharities,
  donateWithApplePay,
  sendProfile,
  onDreamWrite,
  onContributionWrite,
  createContribution,
  sendDream,
  scheduleFunctionWeeklyPay,
  addDreamToAlgolia,
  editDreamToAlgolia,
  userToAlgoliaTrigger
}
