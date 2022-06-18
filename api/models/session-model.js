const fetch = require('node-fetch');
const {response} = require("express");

//fs (included in express)
/*const fs = require('fs');

fs.readFile("./customer.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    console.log("File data:", jsonString);
});

const customer = {
    name: "Newbie Co.",
    order_count: 0,
    address: "Po Box City",
}
const jsonString = JSON.stringify(customer)
fs.writeFile('./newCustomer.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})*/

//==================================
//fs-extra
//requires npm install fs-extra
/*const { writeJson } = require('fs-extra');

const path = './config.json';
const config = { ip: '192.0.2.1', port: 3456 };

// Using callback
writeJson(path, config, (error) => {
    if (error) {
        console.log('An error has occurred');
        return;
    }
    console.log('Data written to file successfully ');
});

// Using promise chaining
writeJson(path, config)
    .then(() => {
        console.log('Data written to file successfully ');
    })
    .catch((error) => {
        console.log(error);
    });

// Using async/await
async function writeJsonData() {
    try {
        await writeJson(path, config);
        console.log('Data written to file successfully ');
    } catch (error) {
        console.log(error);
    }
}*/
//writeJsonData();


