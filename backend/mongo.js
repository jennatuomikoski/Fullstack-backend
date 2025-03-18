const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://jennatuomikoski:${password}@cluster0.qke47.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const PhoneBook = mongoose.model('PhoneBook', phonebookSchema)

if (name && number) {
    const phoneEntry = new PhoneBook({
        name: name,
        number: number,
    })

    phoneEntry.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    PhoneBook.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
        })
        mongoose.connection.close()
    })
}