import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'

let jsonPath = '../../user/transactions/tx0.json'

let array = txParser.parseTx(jsonPath)
console.log(txProcessor.verify(array[0],array[1],array[2]))