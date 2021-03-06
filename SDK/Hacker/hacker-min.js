window.zmCocosAudioEngine = function () {
  /****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
  //const ZMSDK = require('../ZMSDK');
  const EventTarget = cc.EventTarget;
  const sys = cc.sys;
  const AudioClip = cc.AudioClip;
  const LoadMode = cc.Enum({
    WEB_AUDIO: 0,
    DOM_AUDIO: 1,
  });

  let touchBinded = false;
  let touchPlayList = [
    //{ instance: Audio, offset: 0, audio: audio }
  ];

  let Audio = (cc.Audio = function (src) {
    EventTarget.call(this);

    this._src = src;
    this._element = null;
    this.id = 1;
    this._id = this.id;

    this._volume = 1;
    this._loop = false;
    this._nextTime = 0; // playback position to set

    this._state = Audio.State.INITIALZING;
    this._isLocal = false;
    this._callBackId = -1;

    this._onended = function () {
      this.emit('ended');
    }.bind(this);
  });

  cc.js.extend(Audio, EventTarget);

  /**
   * !#en Audio state.
   * !#zh ??????????????????
   * @enum audioEngine.AudioState
   * @memberof cc
   */
  // TODO - At present, the state is mixed with two states of users and systems, and it is best to split into two types. A "loading" should also be added to the system state.
  Audio.State = {
    /**
     * @property {Number} ERROR
     */
    ERROR: -1,
    /**
     * @property {Number} INITIALZING
     */
    INITIALZING: 0,
    /**
     * @property {Number} PLAYING
     */
    PLAYING: 1,
    /**
     * @property {Number} PAUSED
     */
    PAUSED: 2,
    /**
     * @property {Number} STOPPED
     */
    STOPPED: 3,
  };

  (function (proto) {
    proto._bindEnded = function (callback) {
      callback = callback || this._onended;
      let elem = this._element;
      if (this._src && elem instanceof HTMLAudioElement) {
        elem.addEventListener('ended', callback);
      } else {
        elem.onended = callback;
      }
    };

    proto._unbindEnded = function () {
      let elem = this._element;
      if (elem instanceof HTMLAudioElement) {
        elem.removeEventListener('ended', this._onended);
      } else if (elem) {
        elem.onended = null;
      }
    };

    // proto.mount = function (elem) {
    //     if (CC_DEBUG) {
    //         cc.warn('Audio.mount(value) is deprecated. Please use Audio._onLoaded().');
    //     }
    // };

    proto._onLoaded = function () {
      let elem = this._src._nativeAsset;
      if (elem instanceof HTMLAudioElement) {
        // Reuse dom audio element
        if (!this._element) {
          this._element = document.createElement('audio');
        }
        this._element.src = elem.src;
      } else {
        this._element = new WebAudioElement(elem, this);
      }

      this.setVolume(this._volume);
      this.setLoop(this._loop);
      if (this._nextTime !== 0) {
        this.setCurrentTime(this._nextTime);
      }
      if (this._state === Audio.State.PLAYING) {
        this.play();
      } else {
        this._state = Audio.State.INITIALZING;
      }
    };

    proto.play = function () {
      // marked as playing so it will playOnLoad
      this._state = Audio.State.PLAYING;

      if (!this._element) {
        return;
      }

      //cc.log("--mmp--", this._element);
      this._bindEnded();
      if (window.ZMSDK.isLocalMusic() || window.ZMSDK.isPcMix()) {
        this._isLocal = true;
        this.sendMsg('play');
        // var url = this._src.nativeUrl;
        // if (url && cc.loader.md5Pipe) {
        //   url = cc.loader.md5Pipe.transformURL(url);
        // }
        // //cc.log("--ipad-play audio");
        // let data = {
        //   audioID: this.id,
        //   nativeUrl: url,
        //   loop: this._loop,
        //   cmd: 'play',
        // };
        // //cc.log("--mmp--", "audioctl__"+data);
        // if (window.ZMSDK.isPcMix()) {
        //   data.nativeUrl = window.ZMSDK.gameRoot() + url;
        //   window['ZMClientBridge'].audioControl && window['ZMClientBridge'].audioControl(data);
        // }else{
        //   window.ZMSDK.sendMsg('audioctl', data, false);
        // }
        if(!this._loop) {
          let delay = this._src._audio.duration * 1000;
          clearTimeout(this._callBackId);
          this._callBackId = setTimeout(() => {
            this.emit('ended');
          }, delay);
        }
      } else {
        this._isLocal = false;
        this._element.play();
        this.sendLog('play', false);
      }

      if (!CC_QQPLAY && !CC_WECHATGAME) {
        if (
          this._src &&
          this._src.loadMode === LoadMode.DOM_AUDIO &&
          this._element.paused
        ) {
          touchPlayList.push({
            instance: this,
            offset: 0,
            audio: this._element,
          });
        }

        if (touchBinded) return;
        touchBinded = true;

        // Listen to the touchstart body event and play the audio when necessary.
        cc.game.canvas.addEventListener('touchstart', function () {
          let item;
          while ((item = touchPlayList.pop())) {
            item.audio.play(item.offset);
          }
        });
      }
    };

    proto.destroy = function () {
      if (CC_WECHATGAME) {
        this._element && this._element.destroy();
      }
      this._element = null;
    };

    proto.pause = function () {
      if (!this._element || this._state !== Audio.State.PLAYING) return;
      this._unbindEnded();
      if (window.ZMSDK.isLocalMusic() || window.ZMSDK.isPcMix()) {
        this.sendMsg('pause');
        // var url = this._src.nativeUrl;
        // if (url && cc.loader.md5Pipe) {
        //   url = cc.loader.md5Pipe.transformURL(url);
        // }
        // //cc.log("--ipad-pause audio",);
        // let data = {
        //   audioID: this.id,
        //   nativeUrl: url,
        //   loop: this._loop,
        //   cmd: 'pause',
        // };
        // if (window.ZMSDK.isPcMix()) {
        //   data.nativeUrl = window.ZMSDK.gameRoot() + url;
        //   window['ZMClientBridge'].audioControl && window['ZMClientBridge'].audioControl(data);
        // }else{
        //   window.ZMSDK.sendMsg('audioctl', data, false);
        // }
      } else {
        this.sendLog('pause', false);
        this._element.pause();
      }
      this._state = Audio.State.PAUSED;
    };

    proto.resume = function () {
      if (!this._element || this._state !== Audio.State.PAUSED) return;
      this._bindEnded();
      // this._element.play();
      if (window.ZMSDK.isLocalMusic() || window.ZMSDK.isPcMix()) {
        this.sendMsg('resume');
        // var url = this._src.nativeUrl;
        // if (url && cc.loader.md5Pipe) {
        //   url = cc.loader.md5Pipe.transformURL(url);
        // }
        // //cc.log("--ipad-resume audio");
        // let data = {
        //   audioID: this.id,
        //   nativeUrl: url,
        //   loop: this._loop,
        //   cmd: 'resume',
        // };
        // if (window.ZMSDK.isPcMix()) {
        //   data.nativeUrl = window.ZMSDK.gameRoot() + url;
        //   window['ZMClientBridge'].audioControl && window['ZMClientBridge'].audioControl(data);
        // }else{
        //   window.ZMSDK.sendMsg('audioctl', data, false);
        // }
      } else {
        this._element.play();
        this.sendLog('resume', false);
      }
      this._state = Audio.State.PLAYING;
    };

    proto.stop = function () {
      if (!this._element) return;
      // this._element.pause();
      if (window.ZMSDK.isLocalMusic() || window.ZMSDK.isPcMix()) {
        this.sendMsg('stop');
        // var url = this._src.nativeUrl;
        // if (url && cc.loader.md5Pipe) {
        //   url = cc.loader.md5Pipe.transformURL(url);
        // }
        // //cc.log("--ipad-pause audio");
        // let data = {
        //   audioID: this.id,
        //   nativeUrl: url,
        //   loop: this._loop,
        //   cmd: 'stop',
        // };
        // if (window.ZMSDK.isPcMix()) {
        //   data.nativeUrl = window.ZMSDK.gameRoot() + url;
        //   window['ZMClientBridge'].audioControl && window['ZMClientBridge'].audioControl(data);
        // }else{
        //   window.ZMSDK.sendMsg('audioctl', data, false);
        // }
      } else {
        this.sendLog('stop', false);
        this._element.pause();
      }
      try {
        this._element.currentTime = 0;
      } catch (error) { }
      // remove touchPlayList
      for (let i = 0; i < touchPlayList.length; i++) {
        if (touchPlayList[i].instance === this) {
          touchPlayList.splice(i, 1);
          break;
        }
      }
      this._unbindEnded();
      this.emit('stop');
      this._state = Audio.State.STOPPED;
    };

    proto.setLoop = function (loop) {
      this._loop = loop;
      if (this._element) {
        this._element.loop = loop;
      }
    };
    proto.getLoop = function () {
      return this._loop;
    };

    proto.setVolume = function (num) {
      this._volume = num;
      if (this._element) {
        this._element.volume = num;
      }
    };
    proto.getVolume = function () {
      return this._volume;
    };

    proto.setCurrentTime = function (num) {
      if (this._element) {
        this._nextTime = 0;
      } else {
        this._nextTime = num;
        return;
      }

      this._unbindEnded();
      if (!(CC_QQPLAY || CC_WECHATGAME)) {
        this._bindEnded(
          function () {
            this._bindEnded();
          }.bind(this)
        );
      }
      try {
        this._element.currentTime = num;
      } catch (err) {
        let _element = this._element;
        if (_element.addEventListener) {
          let func = function () {
            _element.removeEventListener('loadedmetadata', func);
            _element.currentTime = num;
          };
          _element.addEventListener('loadedmetadata', func);
        }
      }
    };
    proto.getCurrentTime = function () {
      return this._element ? this._element.currentTime : 0;
    };

    proto.getDuration = function () {
      return this._element ? this._element.duration : 0;
    };

    proto.getState = function () {
      if (!CC_WECHATGAME) {
        let elem = this._element;
        if(!this._isLocal) {
          if (elem && Audio.State.PLAYING === this._state && elem.paused) {
            this._state = Audio.State.PAUSED;
          }
        }
      }
      return this._state;
    };

    proto.__defineGetter__('src', function () {
      return this._src;
    });
    proto.__defineSetter__('src', function (clip) {
      this._unbindEnded();
      if (clip) {
        this._src = clip;
        if (clip.loaded) {
          this._onLoaded();
        } else {
          let self = this;
          clip.once('load', function () {
            if (clip === self._src) {
              self._onLoaded();
            }
          });
          cc.loader.load(
            {
              url: clip.nativeUrl,
              // For audio, we should skip loader otherwise it will load a new audioClip.
              skips: ['Loader'],
            },
            function (err, audioNativeAsset) {
              if (err) {
                cc.error(err);
                return;
              }
              if (!clip.loaded) {
                clip._nativeAsset = audioNativeAsset;
              }
            }
          );
        }
      } else {
        this._src = null;
        if (this._element instanceof HTMLAudioElement) {
          this._element.src = '';
        } else {
          this._element = null;
        }
        this._state = Audio.State.INITIALZING;
      }
      return clip;
    });

    proto.__defineGetter__('paused', function () {
      return this._element ? this._element.paused : true;
    });

    proto.sendMsg = function (command) {
      if (!this._element) {
        return;
      }
      var url = this._src.nativeUrl;
      if (url && cc.loader.md5Pipe) {
        url = cc.loader.md5Pipe.transformURL(url);
      }
      let data = {
        audioID: this.id,
        nativeUrl: url,
        loop: this._loop,
        cmd: command,
      };
      if (window.ZMSDK.isPcMix()) {
        data.nativeUrl = window.ZMSDK.gameRoot() + url;
        window['ZMClientBridge'].audioControl && window['ZMClientBridge'].audioControl(data);
      } else {
        window.ZMSDK.sendMsg('audioctl', data, false);
      }
      this.sendLog(command, true);
    }

    proto.sendLog = function (cmd, isMix) {
      if (!this._element) {
        return;
      }
      var url = this._src.nativeUrl;
      if (url && cc.loader.md5Pipe) {
        url = cc.loader.md5Pipe.transformURL(url);
      }
      let data = {
        audioID: this.id,
        nativeUrl: url,
        isLoop: this._loop,
        playCMD: cmd,
        duration: this._element.duration,
        isMixPlay: isMix
      };
      window.ZMSDK.sendLog('audioPlay', data);
    }
    // setFinishCallback
  })(Audio.prototype);

  // Encapsulated WebAudio interface
  let WebAudioElement = function (buffer, audio) {
    this._audio = audio;
    this._context = sys.__audioSupport.context;
    this._buffer = buffer;

    this._gainObj = this._context['createGain']();
    this._volume = 1;
    // https://www.chromestatus.com/features/5287995770929152
    if (this._gainObj['gain'].setTargetAtTime) {
      this._gainObj['gain'].setTargetAtTime(
        this._volume,
        this._context.currentTime,
        0.01
      );
    } else {
      this._gainObj['gain'].value = 1;
    }
    this._gainObj['connect'](this._context['destination']);

    this._loop = false;
    // The time stamp on the audio time axis when the recording begins to play.
    this._startTime = -1;
    // Record the currently playing 'Source'
    this._currentSource = null;
    // Record the time has been played
    this.playedLength = 0;

    this._currextTimer = null;

    this._endCallback = function () {
      if (this.onended) {
        this.onended(this);
      }
    }.bind(this);
  };

  (function (proto) {
    proto.play = function (offset) {
      // If repeat play, you need to stop before an audio
      if (this._currentSource && !this.paused) {
        this._currentSource.onended = null;
        this._currentSource.stop(0);
        this.playedLength = 0;
      }

      let audio = this._context['createBufferSource']();
      audio.buffer = this._buffer;
      audio['connect'](this._gainObj);
      audio.loop = this._loop;

      this._startTime = this._context.currentTime;
      offset = offset || this.playedLength;
      if (offset) {
        this._startTime -= offset;
      }
      let duration = this._buffer.duration;

      let startTime = offset;
      let endTime;
      if (this._loop) {
        if (audio.start) audio.start(0, startTime);
        else if (audio['notoGrainOn']) audio['noteGrainOn'](0, startTime);
        else audio['noteOn'](0, startTime);
      } else {
        endTime = duration - offset;
        if (audio.start) audio.start(0, startTime, endTime);
        else if (audio['notoGrainOn'])
          audio['noteGrainOn'](0, startTime, endTime);
        else audio['noteOn'](0, startTime, endTime);
      }

      this._currentSource = audio;

      audio.onended = this._endCallback;

      // If the current audio context time stamp is 0 and audio context state is suspended
      // There may be a need to touch events before you can actually start playing audio
      if (
        (!audio.context.state || audio.context.state === 'suspended') &&
        this._context.currentTime === 0
      ) {
        let self = this;
        clearTimeout(this._currextTimer);
        this._currextTimer = setTimeout(function () {
          if (
            !(CC_QQPLAY || CC_WECHATGAME) &&
            self._context.currentTime === 0
          ) {
            touchPlayList.push({
              instance: self._audio,
              offset: offset,
              audio: self,
            });
          }
        }, 10);
      }
    };

    proto.pause = function () {
      clearTimeout(this._currextTimer);
      if (this.paused) return;
      // Record the time the current has been played
      this.playedLength = this._context.currentTime - this._startTime;
      // If more than the duration of the audio, Need to take the remainder
      this.playedLength %= this._buffer.duration;
      let audio = this._currentSource;
      this._currentSource = null;
      this._startTime = -1;
      if (audio) audio.stop(0);
    };

    proto.__defineGetter__('paused', function () {
      // If the current audio is a loop, paused is false
      if (this._currentSource && this._currentSource.loop) return false;

      // startTime default is -1
      if (this._startTime === -1) return true;

      // Current time -  Start playing time > Audio duration
      return (
        this._context.currentTime - this._startTime > this._buffer.duration
      );
    });

    proto.__defineGetter__('loop', function () {
      return this._loop;
    });
    proto.__defineSetter__('loop', function (bool) {
      if (this._currentSource) this._currentSource.loop = bool;

      return (this._loop = bool);
    });

    proto.__defineGetter__('volume', function () {
      return this._volume;
    });
    proto.__defineSetter__('volume', function (num) {
      this._volume = num;
      if (this._gainObj['gain'].setTargetAtTime) {
        this._gainObj['gain'].setTargetAtTime(
          this._volume,
          this._context.currentTime,
          0.01
        );
      } else {
        this._volume['gain'].value = num;
      }
      if (sys.os === sys.OS_IOS && !this.paused && this._currentSource) {
        // IOS must be stop webAudio
        this._currentSource.onended = null;
        this.pause();
        this.play();
      }
      return num;
    });

    proto.__defineGetter__('currentTime', function () {
      if (this.paused) {
        return this.playedLength;
      }
      // Record the time the current has been played
      this.playedLength = this._context.currentTime - this._startTime;
      // If more than the duration of the audio, Need to take the remainder
      this.playedLength %= this._buffer.duration;
      return this.playedLength;
    });
    proto.__defineSetter__('currentTime', function (num) {
      if (!this.paused) {
        this.pause();
        this.playedLength = num;
        this.play();
      } else {
        this.playedLength = num;
      }
      return num;
    });

    proto.__defineGetter__('duration', function () {
      return this._buffer.duration;
    });
  })(WebAudioElement.prototype);

  /****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

  const js = cc.js;

  let _instanceId = 0;
  let _id2audio = js.createMap(true);
  let _url2id = {};
  let _audioPool = [];

  let recycleAudio = function (audio) {
    audio._finishCallback = null;
    clearTimeout(audio._callBackId);
    audio._callBackId = -1;
    if (_audioPool.length < 32) {
      audio.off('ended');
      audio.off('stop');
      audio.src = null;
      audio._isLocal = false;
      _audioPool.push(audio);
    } else {
      audio.destroy();
    }
  };

  let getAudioFromPath = function (path) {
    var id = _instanceId++;
    var list = _url2id[path];
    if (!list) {
      list = _url2id[path] = [];
    }
    if (audioEngine._maxAudioInstance <= list.length) {
      var oldId = list.shift();
      var oldAudio = getAudioFromId(oldId);
      // Stop will recycle audio automatically by event callback
      oldAudio.stop();
    }

    var audio = _audioPool.pop() || new Audio();
    var callback = function () {
      var audioInList = getAudioFromId(this.id);
      if (audioInList) {
        delete _id2audio[this.id];
        var index = list.indexOf(this.id);
        cc.js.array.fastRemoveAt(list, index);
      }
      recycleAudio(this);
    };
    audio.on(
      'ended',
      function () {
        if (this._finishCallback) {
          this._finishCallback();
        }
        callback.call(this);
      },
      audio
    );
    audio.on('stop', callback, audio);
    audio.id = id;
    _id2audio[id] = audio;
    list.push(id);

    return audio;
  };

  let getAudioFromId = function (id) {
    return _id2audio[id];
  };

  /**
   * !#en cc.audioEngine is the singleton object, it provide simple audio APIs.
   * !#zh
   * cc.audioengine??????????????????<br/>
   * ????????????????????????????????????????????????????????? audioID?????????????????????????????? audioID ??????????????????????????????<br/>
   * ?????????????????????????????? cc.audioEngine.uncache(filePath); ?????????????????? <br/>
   * ?????????<br/>
   * ??? Android ???????????????????????????????????????????????????????????????????????????<br/>
   * ????????????????????????????????????????????????????????????????????????????????????????????????????????? WebAudio???<br/>
   * ?????????????????????????????????????????????????????????????????????????????????????????????????????????
   * @class audioEngine
   * @static
   */
  var audioEngine = {
    AudioState: Audio.State,

    _maxWebAudioSize: 2097152, // 2048kb * 1024
    _maxAudioInstance: 24,

    _id2audio: _id2audio,

    /**
     * !#en Play audio.
     * !#zh ????????????
     * @method play
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @param {Number} volume - Volume size.
     * @return {Number} audioId
     * @example
     * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
     *     var audioID = cc.audioEngine.play(clip, false, 0.5);
     * });
     */
    play: function (clip, loop, volume /*, profile*/) {
      var path = clip;
      var audio;
      if (typeof clip === 'string') {
        // backward compatibility since 1.10
        cc.warnID(
          8401,
          'cc.audioEngine',
          'cc.AudioClip',
          'AudioClip',
          'cc.AudioClip',
          'audio'
        );
        path = clip;
        // load clip
        audio = getAudioFromPath(path);
        AudioClip._loadByUrl(path, function (err, clip) {
          if (clip) {
            audio.src = clip;
          }
        });
      } else {
        if (!clip) {
          return;
        }
        path = clip.nativeUrl;
        audio = getAudioFromPath(path);
        audio.src = clip;
      }

      audio.setLoop(loop || false);
      if (typeof volume !== 'number') {
        volume = 1;
      }
      audio.setVolume(volume);
      audio.play();

      return audio.id;
    },

    /**
     * !#en Set audio loop.
     * !#zh ???????????????????????????
     * @method setLoop
     * @param {Number} audioID - audio id.
     * @param {Boolean} loop - Whether cycle.
     * @example
     * cc.audioEngine.setLoop(id, true);
     */
    setLoop: function (audioID, loop) {
      var audio = getAudioFromId(audioID);
      if (!audio || !audio.setLoop) return;
      audio.setLoop(loop);
    },

    /**
     * !#en Get audio cycle state.
     * !#zh ??????????????????????????????
     * @method isLoop
     * @param {Number} audioID - audio id.
     * @return {Boolean} Whether cycle.
     * @example
     * cc.audioEngine.isLoop(id);
     */
    isLoop: function (audioID) {
      var audio = getAudioFromId(audioID);
      if (!audio || !audio.getLoop) return false;
      return audio.getLoop();
    },

    /**
     * !#en Set the volume of audio.
     * !#zh ???????????????0.0 ~ 1.0??????
     * @method setVolume
     * @param {Number} audioID - audio id.
     * @param {Number} volume - Volume must be in 0.0~1.0 .
     * @example
     * cc.audioEngine.setVolume(id, 0.5);
     */
    setVolume: function (audioID, volume) {
      var audio = getAudioFromId(audioID);
      if (audio) {
        audio.setVolume(volume);
      }
    },

    /**
     * !#en The volume of the music max value is 1.0,the min value is 0.0 .
     * !#zh ???????????????0.0 ~ 1.0??????
     * @method getVolume
     * @param {Number} audioID - audio id.
     * @return {Number}
     * @example
     * var volume = cc.audioEngine.getVolume(id);
     */
    getVolume: function (audioID) {
      var audio = getAudioFromId(audioID);
      return audio ? audio.getVolume() : 1;
    },

    /**
     * !#en Set current time
     * !#zh ??????????????????????????????
     * @method setCurrentTime
     * @param {Number} audioID - audio id.
     * @param {Number} sec - current time.
     * @return {Boolean}
     * @example
     * cc.audioEngine.setCurrentTime(id, 2);
     */
    setCurrentTime: function (audioID, sec) {
      var audio = getAudioFromId(audioID);
      if (audio) {
        audio.setCurrentTime(sec);
        return true;
      } else {
        return false;
      }
    },

    /**
     * !#en Get current time
     * !#zh ????????????????????????????????????
     * @method getCurrentTime
     * @param {Number} audioID - audio id.
     * @return {Number} audio current time.
     * @example
     * var time = cc.audioEngine.getCurrentTime(id);
     */
    getCurrentTime: function (audioID) {
      var audio = getAudioFromId(audioID);
      return audio ? audio.getCurrentTime() : 0;
    },

    /**
     * !#en Get audio duration
     * !#zh ????????????????????????
     * @method getDuration
     * @param {Number} audioID - audio id.
     * @return {Number} audio duration.
     * @example
     * var time = cc.audioEngine.getDuration(id);
     */
    getDuration: function (audioID) {
      var audio = getAudioFromId(audioID);
      return audio ? audio.getDuration() : 0;
    },

    /**
     * !#en Get audio state
     * !#zh ?????????????????????
     * @method getState
     * @param {Number} audioID - audio id.
     * @return {audioEngine.AudioState} audio duration.
     * @example
     * var state = cc.audioEngine.getState(id);
     */
    getState: function (audioID) {
      var audio = getAudioFromId(audioID);
      return audio ? audio.getState() : this.AudioState.ERROR;
    },

    /**
     * !#en Set Audio finish callback
     * !#zh ????????????????????????????????????
     * @method setFinishCallback
     * @param {Number} audioID - audio id.
     * @param {Function} callback - loaded callback.
     * @example
     * cc.audioEngine.setFinishCallback(id, function () {});
     */
    setFinishCallback: function (audioID, callback) {
      var audio = getAudioFromId(audioID);
      if (!audio) return;
      audio._finishCallback = callback;
    },

    /**
     * !#en Pause playing audio.
     * !#zh ???????????????????????????
     * @method pause
     * @param {Number} audioID - The return value of function play.
     * @example
     * cc.audioEngine.pause(audioID);
     */
    pause: function (audioID) {
      var audio = getAudioFromId(audioID);
      if (audio) {
        audio.pause();
        return true;
      } else {
        return false;
      }
    },

    _pauseIDCache: [],
    /**
     * !#en Pause all playing audio
     * !#zh ??????????????????????????????????????????
     * @method pauseAll
     * @example
     * cc.audioEngine.pauseAll();
     */
    pauseAll: function () {
      for (var id in _id2audio) {
        var audio = _id2audio[id];
        var state = audio.getState();
        if (state === Audio.State.PLAYING) {
          this._pauseIDCache.push(id);
          audio.pause();
        }
      }
    },

    /**
     * !#en Resume playing audio.
     * !#zh ??????????????????????????????
     * @method resume
     * @param {Number} audioID - The return value of function play.
     * @example
     * cc.audioEngine.resume(audioID);
     */
    resume: function (audioID) {
      var audio = getAudioFromId(audioID);
      if (audio) {
        audio.resume();
      }
    },

    /**
     * !#en Resume all playing audio.
     * !#zh ????????????????????????????????????????????????
     * @method resumeAll
     * @example
     * cc.audioEngine.resumeAll();
     */
    resumeAll: function () {
      for (var i = 0; i < this._pauseIDCache.length; ++i) {
        var id = this._pauseIDCache[i];
        var audio = getAudioFromId(id);
        if (audio) audio.resume();
      }
      this._pauseIDCache.length = 0;
    },

    /**
     * !#en Stop playing audio.
     * !#zh ???????????????????????????
     * @method stop
     * @param {Number} audioID - The return value of function play.
     * @example
     * cc.audioEngine.stop(audioID);
     */
    stop: function (audioID) {
      var audio = getAudioFromId(audioID);
      if (audio) {
        // Stop will recycle audio automatically by event callback
        audio.stop();
        return true;
      } else {
        return false;
      }
    },

    /**
     * !#en Stop all playing audio.
     * !#zh ????????????????????????????????????
     * @method stopAll
     * @example
     * cc.audioEngine.stopAll();
     */
    stopAll: function () {
      for (var id in _id2audio) {
        var audio = _id2audio[id];
        if (audio) {
          // Stop will recycle audio automatically by event callback
          audio.stop();
        }
      }
    },

    /**
     * !#en Set up an audio can generate a few examples.
     * !#zh ??????????????????????????????????????????
     * @method setMaxAudioInstance
     * @param {Number} num - a number of instances to be created from within an audio
     * @example
     * cc.audioEngine.setMaxAudioInstance(20);
     */
    setMaxAudioInstance: function (num) {
      this._maxAudioInstance = num;
    },

    /**
     * !#en Getting audio can produce several examples.
     * !#zh ??????????????????????????????????????????
     * @method getMaxAudioInstance
     * @return {Number} a - number of instances to be created from within an audio
     * @example
     * cc.audioEngine.getMaxAudioInstance();
     */
    getMaxAudioInstance: function () {
      return this._maxAudioInstance;
    },

    /**
     * !#en Unload the preloaded audio from internal buffer.
     * !#zh ???????????????????????????
     * @method uncache
     * @param {AudioClip} clip
     * @example
     * cc.audioEngine.uncache(filePath);
     */
    uncache: function (clip) {
      var filePath = clip;
      if (typeof clip === 'string') {
        // backward compatibility since 1.10
        cc.warnID(
          8401,
          'cc.audioEngine',
          'cc.AudioClip',
          'AudioClip',
          'cc.AudioClip',
          'audio'
        );
        filePath = clip;
      } else {
        if (!clip) {
          return;
        }
        filePath = clip.nativeUrl;
      }

      var list = _url2id[filePath];
      if (!list) return;
      while (list.length > 0) {
        var id = list.pop();
        var audio = _id2audio[id];
        if (audio) {
          // Stop will recycle audio automatically by event callback
          audio.stop();
          delete _id2audio[id];
        }
      }
    },

    /**
     * !#en Unload all audio from internal buffer.
     * !#zh ?????????????????????
     * @method uncacheAll
     * @example
     * cc.audioEngine.uncacheAll();
     */
    uncacheAll: function () {
      this.stopAll();
      let audio;
      for (let id in _id2audio) {
        audio = _id2audio[id];
        if (audio) {
          audio.destroy();
        }
      }
      while ((audio = _audioPool.pop())) {
        audio.destroy();
      }
      _id2audio = js.createMap(true);
      _url2id = {};
    },

    /**
     * !#en Gets an audio profile by name.
     *
     * @param profileName A name of audio profile.
     * @return The audio profile.
     */
    getProfile: function (profileName) { },

    /**
     * !#en Preload audio file.
     * !#zh ?????????????????????
     * @method preload
     * @param {String} filePath - The file path of an audio.
     * @param {Function} [callback] - The callback of an audio.
     * @example
     * cc.audioEngine.preload(path);
     * @deprecated `cc.audioEngine.preload` is deprecated, use `cc.loader.loadRes(url, cc.AudioClip)` instead please.
     */
    preload: function (filePath, callback) {
      if (CC_DEBUG) {
        cc.warn(
          '`cc.audioEngine.preload` is deprecated, use `cc.loader.loadRes(url, cc.AudioClip)` instead please.'
        );
      }

      cc.loader.load(
        filePath,
        callback &&
        function (error) {
          if (!error) {
            callback();
          }
        }
      );
    },

    /**
     * !#en Set a size, the unit is KB. Over this size is directly resolved into DOM nodes.
     * !#zh ??????????????? KB ????????????????????????????????????????????????????????????????????????????????? dom ????????????
     * @method setMaxWebAudioSize
     * @param {Number} kb - The file path of an audio.
     * @example
     * cc.audioEngine.setMaxWebAudioSize(300);
     */
    // Because webAudio takes up too much memory???So allow users to manually choose
    setMaxWebAudioSize: function (kb) {
      this._maxWebAudioSize = kb * 1024;
    },

    _breakCache: null,
    _break: function () {
      this._breakCache = [];
      for (var id in _id2audio) {
        var audio = _id2audio[id];
        var state = audio.getState();
        if (state === Audio.State.PLAYING) {
          this._breakCache.push(id);
          audio.pause();
        }
      }
    },

    _restore: function () {
      if (!this._breakCache) return;

      while (this._breakCache.length > 0) {
        var id = this._breakCache.pop();
        var audio = getAudioFromId(id);
        if (audio && audio.resume) audio.resume();
      }
      this._breakCache = null;
    },

    ///////////////////////////////
    // Classification of interface

    _music: {
      id: -1,
      loop: false,
      volume: 1,
    },

    _effect: {
      volume: 1,
      pauseCache: [],
    },

    /**
     * !#en Play background music
     * !#zh ??????????????????
     * @method playMusic
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
     *     var audioID = cc.audioEngine.playMusic(clip, false);
     * });
     */
    playMusic: function (clip, loop) {
      var music = this._music;
      this.stop(music.id);
      music.id = this.play(clip, loop, music.volume);
      music.loop = loop;
      return music.id;
    },

    /**
     * !#en Stop background music.
     * !#zh ???????????????????????????
     * @method stopMusic
     * @example
     * cc.audioEngine.stopMusic();
     */
    stopMusic: function () {
      this.stop(this._music.id);
    },

    /**
     * !#en Pause the background music.
     * !#zh ???????????????????????????
     * @method pauseMusic
     * @example
     * cc.audioEngine.pauseMusic();
     */
    pauseMusic: function () {
      this.pause(this._music.id);
      return this._music.id;
    },

    /**
     * !#en Resume playing background music.
     * !#zh ???????????????????????????
     * @method resumeMusic
     * @example
     * cc.audioEngine.resumeMusic();
     */
    resumeMusic: function () {
      this.resume(this._music.id);
      return this._music.id;
    },

    /**
     * !#en Get the volume(0.0 ~ 1.0).
     * !#zh ???????????????0.0 ~ 1.0??????
     * @method getMusicVolume
     * @return {Number}
     * @example
     * var volume = cc.audioEngine.getMusicVolume();
     */
    getMusicVolume: function () {
      return this._music.volume;
    },

    /**
     * !#en Set the background music volume.
     * !#zh ???????????????????????????0.0 ~ 1.0??????
     * @method setMusicVolume
     * @param {Number} volume - Volume must be in 0.0~1.0.
     * @example
     * cc.audioEngine.setMusicVolume(0.5);
     */
    setMusicVolume: function (volume) {
      var music = this._music;
      music.volume = volume;
      this.setVolume(music.id, music.volume);
      return music.volume;
    },

    /**
     * !#en Background music playing state
     * !#zh ??????????????????????????????
     * @method isMusicPlaying
     * @return {Boolean}
     * @example
     * cc.audioEngine.isMusicPlaying();
     */
    isMusicPlaying: function () {
      return this.getState(this._music.id) === this.AudioState.PLAYING;
    },

    /**
     * !#en Play effect audio.
     * !#zh ????????????
     * @method playEffect
     * @param {AudioClip} clip - The audio clip to play.
     * @param {Boolean} loop - Whether the music loop or not.
     * @return {Number} audioId
     * @example
     * cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
     *     var audioID = cc.audioEngine.playEffect(clip, false);
     * });
     */
    playEffect: function (clip, loop) {
      return this.play(clip, loop || false, this._effect.volume);
    },

    /**
     * !#en Set the volume of effect audio.
     * !#zh ?????????????????????0.0 ~ 1.0??????
     * @method setEffectsVolume
     * @param {Number} volume - Volume must be in 0.0~1.0.
     * @example
     * cc.audioEngine.setEffectsVolume(0.5);
     */
    setEffectsVolume: function (volume) {
      var musicId = this._music.id;
      this._effect.volume = volume;
      for (var id in _id2audio) {
        if (id === musicId) continue;
        audioEngine.setVolume(id, volume);
      }
    },

    /**
     * !#en The volume of the effect audio max value is 1.0,the min value is 0.0 .
     * !#zh ?????????????????????0.0 ~ 1.0??????
     * @method getEffectsVolume
     * @return {Number}
     * @example
     * var volume = cc.audioEngine.getEffectsVolume();
     */
    getEffectsVolume: function () {
      return this._effect.volume;
    },

    /**
     * !#en Pause effect audio.
     * !#zh ?????????????????????
     * @method pauseEffect
     * @param {Number} audioID - audio id.
     * @example
     * cc.audioEngine.pauseEffect(audioID);
     */
    pauseEffect: function (audioID) {
      return this.pause(audioID);
    },

    /**
     * !#en Stop playing all the sound effects.
     * !#zh ???????????????????????????
     * @method pauseAllEffects
     * @example
     * cc.audioEngine.pauseAllEffects();
     */
    pauseAllEffects: function () {
      var musicId = this._music.id;
      var effect = this._effect;
      effect.pauseCache.length = 0;

      for (var id in _id2audio) {
        if (id === musicId) continue;
        var audio = _id2audio[id];
        var state = audio.getState();
        if (state === this.AudioState.PLAYING) {
          effect.pauseCache.push(id);
          audio.pause();
        }
      }
    },

    /**
     * !#en Resume effect audio.
     * !#zh ???????????????????????????
     * @method resumeEffect
     * @param {Number} audioID - The return value of function play.
     * @example
     * cc.audioEngine.resumeEffect(audioID);
     */
    resumeEffect: function (id) {
      this.resume(id);
    },

    /**
     * !#en Resume all effect audio.
     * !#zh ??????????????????????????????????????????
     * @method resumeAllEffects
     * @example
     * cc.audioEngine.resumeAllEffects();
     */
    resumeAllEffects: function () {
      var pauseIDCache = this._effect.pauseCache;
      for (var i = 0; i < pauseIDCache.length; ++i) {
        var id = pauseIDCache[i];
        var audio = _id2audio[id];
        if (audio) audio.resume();
      }
    },

    /**
     * !#en Stop playing the effect audio.
     * !#zh ?????????????????????
     * @method stopEffect
     * @param {Number} audioID - audio id.
     * @example
     * cc.audioEngine.stopEffect(id);
     */
    stopEffect: function (audioID) {
      return this.stop(audioID);
    },

    /**
     * !#en Stop playing all the effects.
     * !#zh ???????????????????????????
     * @method stopAllEffects
     * @example
     * cc.audioEngine.stopAllEffects();
     */
    stopAllEffects: function () {
      var musicId = this._music.id;
      for (var id in _id2audio) {
        if (id === musicId) continue;
        var audio = _id2audio[id];
        var state = audio.getState();
        if (state === audioEngine.AudioState.PLAYING) {
          audio.stop();
        }
      }
    },
  };

  cc.audioEngine = audioEngine;
};

if (window.zmCocosAudioEngine && !CC_EDITOR) {
  cc.log('hacker---~~~');
  window.zmCocosAudioEngine();
}
