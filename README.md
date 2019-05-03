# SSPlayer
![License](http://img.shields.io/badge/License-MIT-green.svg?style=flat)


## 소개
영어 학습용 자막 검색 플레이어
>Subtitle Searche Player

로컬 PC에있는 영화 및 자막을 등록하여 원하는 구문을 검색어를 입력하면 등록해 놓은 자막에서 해당 위치를 찾아서 영상과
자막을 보여 주는 영어 학습용 플레이어 입니다. 

추가 기능으로 현재 네이버, 다음 어학사전과 연동하여 검색어를 자막검색과 함께 동시에 어학사전결과도 확인할 수 있습니다.

#### Screenshots
![player](https://i.imgur.com/joTpSgU.jpg)

### Supported video file types
- avi
- mp4
- webm
- mkv
- m4v
- ogg
- mov

### Supported subtitle file types
- srt
- smi
- vtt

## Build From Source
``` 
# download source
git clone https://github.com/hitari/ssplayer.git

# install dependencies
npm install

# sqlite3 rebuild
npm run rebuild:sqlite3

# build electron application for develope
npm run dev
(dev build시 위에 sqlite3 rebuild 작업을 먼저 해주셔야합니다.)

# build electron application for production
npm run build

```

---

### Latest Releases:

#### Windows - v0.1.0 - [Download](https://github.com/hitari/ssplayer/releases/download/0.1.0/ssplayer.Setup.0.1.0.exe)

### Developed using:
Electron, Vue, Vuex, Sqlite3, ffmpeg