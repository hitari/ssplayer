import { app, BrowserWindow, webContents, ipcMain } from 'electron'

// const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const Subtitle = require('subtitle');
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle');
const smi2vtt = require('smi2vtt');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  console.log('--createWindow--');
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1066,
    // width:1400,
    height: 480,
    useContentSize: true,
    frame: false,
    // resizable: false,
    webPreferences: {
      webSecurity: false
    }
  })

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  
  mainWindow.webContents.on('new-window', (event, url, frameName) => {
    event.preventDefault()
    const win = new BrowserWindow({ width: 1100, height: 580, show: false, id: frameName })//parent: mainWindow,
    win.webContents.closeDevTools();
    win.setMenu(null);
    // win.setAlwaysOnTop(true);
    win.once('ready-to-show', () => win.show())
    win.loadURL(url)
    event.newGuest = win
  });
}

function makeDb () {
  console.log('--makeDb--');
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('./ssplayer.db');
   
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE IF NOT EXISTS product (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, movie_type TEXT, movie_path TEXT, subtitle_type TEXT, subtitle_path TEXT)");
    // db.run("CREATE TABLE IF NOT EXISTS product (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT)");
    // db.run("CREATE TABLE IF NOT EXISTS movie (product_id INTEGER, name TEXT, type TEXT, path TEXT, FOREIGN KEY(product_id) REFERENCES product(id))");
    // db.run("CREATE TABLE IF NOT EXISTS subtitle (product_id INTEGER, name TEXT, type TEXT, path TEXT, FOREIGN KEY(product_id) REFERENCES product(id))");
  });

  db.close();
}

app.on('ready', function(){
  createWindow();
  makeDb ();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }0
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

ipcMain.on('onLoadDic', (event, arg) => {
  let result;
  result = webContents.getAllWebContents();

  for(let i = 0; i < result.length; i++){
    if(result[i].browserWindowOptions){
      if(result[i].browserWindowOptions.id == 'naver'){
        result[i].loadURL('https://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=' + arg);
      }else if(result[i].browserWindowOptions.id == 'daum'){
        result[i].loadURL('https://dic.daum.net/search.do?q=' + arg);
      }
    }
  }
  event.sender.send('renderTest', result);  
});

ipcMain.on('listPlayEvent', (event, arg) => {
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('./ssplayer.db');

  db.all("SELECT * FROM product WHERE id = ?", [arg.id], function(err, all) {
    if(all.length <= 0){
      event.returnValue = '';
      return false;
    }

    let subtitles = [];
    let startTime = 0;
    let endTime = 0;
    if(Number(arg.start) > 5000){
      startTime = Number(arg.start) - 5000
    }

    endTime = arg.end + 5000;

    if(all[0].subtitle_type == 'smi'){
      smi2vtt(all[0].subtitle_path)
      .then( data => {

        parse(data).map(function(cue) {          
          if(cue.start >= startTime && cue.start <= endTime){
            subtitles.push(cue);
          }
        });
        const newSubtitles = resync(subtitles, -(subtitles[0].start));
        const sub = stringifyVtt(newSubtitles);//stringify

        fs.writeFileSync('output.vtt', sub, 'utf8');
      });
    }else{
      let subt = fs.readFileSync(all[0].subtitle_path, 'utf8');

      parse(subt).map(function(cue) {        
        if(cue.start >= startTime && cue.start <= endTime){
          subtitles.push(cue);
        }
      });
      const newSubtitles = resync(subtitles, -(subtitles[0].start));
      const sub = stringifyVtt(newSubtitles);//stringify

      fs.writeFileSync('output.vtt', sub, 'utf8');
    }

    ffmpeg(all[0].movie_path)
    .videoCodec('libx264')
    .audioCodec('libmp3lame')
    .size('320x240')
    .seek(toVttTime(startTime))
    .duration('00:10')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      event.returnValue = 'An error occurred: ' + err.message;
    })
    .on('end', function() {
      console.log('Processing finished !');
      event.returnValue ='Processing finished !';
    })
    .save('./output.mp4');
  });

  db.close();
});

ipcMain.on('onSearchPlayList', (event, arg) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./ssplayer.db');

  db.serialize(function() {
    db.all("SELECT * FROM product", function(err, row) {
      for (let r in row) {
        Object.assign(row[r], {active: false})
      }
      event.returnValue = row;
      db.close();
    });
  })
});

ipcMain.on('onSaveEvent', (event, arg) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./ssplayer.db');

  db.serialize(function() {
    let stmt = db.prepare("INSERT INTO product(name, movie_type, movie_path, subtitle_type, subtitle_path) VALUES(?, ?, ?, ?, ?)");
    for (let i = 0; i < arg.length; i++) {
        stmt.run(arg[i].name, arg[i].movie.type, arg[i].movie.path, arg[i].subtitle.type, arg[i].subtitle.path);
    }
    stmt.finalize();

    db.all("SELECT * FROM product", function(err, row) {
      event.returnValue = row;
      db.close();
    });
  });
});

ipcMain.on('onRemoveEvent', (event, arg) => {
  let sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('./ssplayer.db');

  db.serialize(function() {   
    let stmt = db.prepare("DELETE FROM product WHERE id=?");
    for (let i = 0; i < arg.length; i++) {
        stmt.run(arg[i].id);
    }
    stmt.finalize();

    db.all("SELECT * FROM product", function(err, row) {
      event.returnValue = row;
      db.close();
    });
  });
});

ipcMain.on('onSearchEvent', (event, arg) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./ssplayer.db');

  let result = [];
   
  db.serialize(function() {
    db.all("SELECT id, name, subtitle_type, subtitle_path FROM product", function(err, row) {
    
      for(let i=0; i < row.length; i++){
        let subt;
        if(row[i].subtitle_type == 'smi'){
          smi2vtt(row[i].subtitle_path)
          .then( data => {

            subt = data;

            parse(subt).map(function(cue) {
              
              if(cue.text.replace('\n', ' ').indexOf(arg) > -1){
                let j = {
                  id: row[i].id,
                  name: row[i].name,
                  start: cue.start,
                  end: cue.end,
                  text: cue.text.replace('\n', ' ')
                };
                result.push(j);
              }
            });
          })
        }else{
          subt = fs.readFileSync(row[i].subtitle_path, 'utf8');

          parse(subt).map(function(cue) {
            
            if(cue.text.replace('\n', ' ').indexOf(arg) > -1){
              let j = {
                id: row[i].id,
                start: cue.start,
                end: cue.end,
                text: cue.text.replace('\n', ' ')
              };
              result.push(j);
            }
          });
        }
      }
      
      setTimeout(()=>{
        event.returnValue = result;  
        db.close();
      }, 1000)
    });
  });
});

function naiveSearch(h, n) {
  let ret = [];

  for (let begin = 0; begin + n.length <= h.length; ++begin) {
      let matched = true;
      
      for (let i = 0; i < n.length; ++i) {
          if (h[begin + i] != n[i]) {
              matched = false;
              break;
          }
      }

      if (matched) ret.push(begin);
  }
  return ret;
}

function parse_timestamp(s) {
	//let match = s.match(/^(?:([0-9]{2,}):)?([0-5][0-9]):([0-5][0-9][.,][0-9]{0,3})/);
	// Relaxing the timestamp format:
	let match = s.match(/^(?:([0-9]+):)?([0-5][0-9]):([0-5][0-9](?:[.,][0-9]{0,3})?)/);
	if (match == null) {
		throw 'Invalid timestamp format: ' + s;
	}
	let hours = parseInt(match[1] || "0", 10);
	let minutes = parseInt(match[2], 10);
	let seconds = parseFloat(match[3].replace(',', '.'));
	return seconds + 60 * minutes + 60 * 60 * hours;
}

// https://w3c.github.io/webvtt/
// https://developer.mozilla.org/en/docs/Web/API/Web_Video_Text_Tracks_Format
// https://en.wikipedia.org/wiki/WebVTT
//
// For better parsers, look at:
// https://github.com/annevk/webvtt
// https://github.com/mozilla/vtt.js
function quick_and_dirty_vtt_or_srt_parser(vtt) {
  console.log('--quick_and_dirty_vtt_or_srt_parser--');
	let lines = vtt.trim().replace('\r\n', '\n').split(/[\r\n]/).map(function(line) {
		return line.trim();
  });
  // console.log(lines);
	let cues = [];
	let start = null;
	let end = null;
	let payload = null;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].indexOf('-->') >= 0) {
			let splitted = lines[i].split(/[ \t]+-->[ \t]+/);
			if (splitted.length != 2) {
				throw 'Error when splitting "-->": ' + lines[i];
			}

			// Already ignoring anything past the "end" timestamp (i.e. cue settings).
			start = parse_timestamp(splitted[0]);
			end = parse_timestamp(splitted[1]);
		} else if (lines[i] == '') {
			if (start && end) {
				let cue = { 'start': start, 'end': end, 'text': payload };
				cues.push(cue);
				start = null;
				end = null;
				payload = null;
			}
		} else if(start && end) {
			if (payload == null) {
				payload = lines[i];
			} else {
				payload += '\n' + lines[i];
			}
		}
	}
	if (start && end) {
		let cue = { 'start': start, 'end': end, 'text': payload };
		cues.push(cue);
  }
  
  console.log(cues);

	return cues;
}