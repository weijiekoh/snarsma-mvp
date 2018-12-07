import * as txParser from '../operator/txParser'
import * as txProcessor from '../operator/txProcessor'

let path = '../../user/transactions/tx0.json'

let array = txParser.parseTx(path)
console.log(txProcessor.verify(array[0],array[1],array[2]))