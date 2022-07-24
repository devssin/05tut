const {format} = require('date-fns')
const {v4: uuid} = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async (message,logName) => {
    const dateTime = `${format(new Date, 'yyyy/MM/dd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message} \n`
    console.log(logItem)

    try {
        if(!fs.existsSync('logs')){
            await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', logName), logItem)

    } catch (error) {
        console.error(error)
    }
}
module.exports = logEvents