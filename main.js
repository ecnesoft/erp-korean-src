const { app, BrowserWindow, ipcMain } = require('electron');
let win;
function createWindow() {
  win = new BrowserWindow({ 
    width: 800, height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadURL(`file://${__dirname}/view/index.html`);
  win.on('closed', () => { win = null; });
  win.once('ready-to-show', () => { win.show(); });
}
app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', () => { if (win === null) { createWindow(); } });
const mysql = require('mysql2');
const connection = mysql.createConnection({
  // host: '192.168.0.200',
  host: '220.244.28.225',
  port: 3306,
  user: 'root',
  password: 'this1300',
  database: 'ecne_erp'
});
ipcMain.on('ping', (event, data) => {
  console.log(data);
  event.sender.send('pong', {
    message: 'pong'
  });
});
ipcMain.on('username', (event, data) => {
  connection.query(
    'SELECT username FROM sys_user',
    function (err, results, fields) {
      const usernames = [];
      for (let i = 0; i < results.length; i++) {
        usernames.push(results[i].username);
      }
      event.sender.send('username', usernames);
    }
  );
});
ipcMain.on('onload', (event, data) => {
  connection.execute(
    'SELECT cust_support_id, assignedTo, symptom, cust_request FROM cust_support where cust_support_id = ?', [data],
    function (err, results, fields) {
      event.sender.send('onload', results);
    }
  );
});
ipcMain.on('onload', (event, data) => {
  connection.execute(
    'SELECT cust_support_id, assignedTo, symptom, cust_request FROM cust_support where cust_support_id = ?', [data],
    function (err, results, fields) {
      event.sender.send('onload', results);
    }
  );
});
ipcMain.on('update', (event, data) => {
  connection.execute(
    'UPDATE cust_support set assignedTo = ?, symptom = ?, cust_request= ? where cust_support_id = ?', 
    [data.assignedTo, data.symptom, data.cust_request, data.cust_support_id],
    function (err, results, fields) {
      event.sender.send('update', results);
    }
  );
});