import DEV from './env-dev'
import TEST from './env-test'
import UAT from './env-uat'
import PROD from './env-prod'

const allConfig = {
  DEV,
  TEST,
  UAT,
  PROD
}

const env = process.env.NODE_ENV
const Config = Object.freeze(allConfig[env])
console.log('----------------CurrentConfig------------------', Config);

export default Config