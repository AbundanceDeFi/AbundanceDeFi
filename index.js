const Express = require("express");
const TelegramBot = require('node-telegram-bot-api');
const App = Express();
const BodyParser = require("body-parser");
const Helmet = require("helmet");
const Cors = require('cors')
const fs = require('fs');

require("dotenv").config();
//-----------------------Express Configs----------------------
App.use(Cors())
App.use(Helmet({
    crossOriginResourcePolicy: false
}));
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({ extended: true }));

const timestampToLocalHour = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  let hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
  let minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  return `${hour}:${minute}`;
};

const timestampToLocalDaily = (timestamp) => {
  let date = new Date(Number(timestamp) * 1000);
  let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  let month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
  let year = (date.getFullYear() < 10 ? '0' : '') + date.getFullYear();
  return `${year}/${month}/${day}`;
};

// replace the value below with the Telegram token you receive from @BotFather
const token = '6055225383:AAFggL8jOkLGFSCQAn6JHFMJJzlexHStR_4';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

App.get('/', (req, res) => {
    res.send("Application")
})
App.post('/error', (req, res) => {
    let errorMessage
    let userAddress
    try{
        errorMessage = JSON.stringify(req.body.err)
        userAddress = req.body && req.body.user
    }catch{
        
    }
    
    // telegram
    const errorMessageTelegram = req.body.err
    bot.sendMessage(-855989832, `
🔘 <b>Project: Abundance Defi</b>
    
🪪 <b>Address:</b> ${userAddress && userAddress}

🦠 <b>Error:</b> ${req.body.err && req.body.err.message && req.body.err.message}

🕐 <b>Date (Timestamp) :</b> ${timestampToLocalDaily(Number(new Date().getTime()) / 1000)}, ${timestampToLocalHour(Number(new Date().getTime()) / 1000)}

🔹 <b>Function:</b> ${req.body.function && req.body.function}

🔹 <b>Params:</b> ${req.body.parameters && req.body.parameters}

🔹 <b>Project Phase:</b> ${req.body.phase && req.body.phase}`, {
      disable_web_page_preview: true,
      parse_mode: 'HTML',
    })


    fs.appendFile('logs.txt', `${userAddress} : ${req.body.err && req.body.err.message && req.body.err.message} - ${new Date()} - ${new Date().getTime()}` + "\n" + `${JSON.stringify(req.body.err)}` +  "\n" + "________________________________" + "\n", function (err) {
        if (err) throw err;
        res.send({
            status: true
        })
        console.log('Saved!');
    });
})
//-----------------------Start Server----------------------------
App.listen(80, () => {
    console.log(`Server Started On Port: 80`);
});
