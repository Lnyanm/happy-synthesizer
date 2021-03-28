// pages/metronome/metronome.js

const tik = 'assets/audio/tik.mp3';
const tok = 'assets/audio/tok.mp3';

Page({
  data: {
    bpm: 100,
    round: 4,
    counter: -1,
    bpmLimit: {
      min: 30,
      max: 244
    },
    running: false,
  },
  onHide() {
    // 页面不可见时，停止定时任务
    if (this.data.running) {
      this.handleClickStartButton();
    }
  },
  handleClickStartButton() {
    this.setData({
      running: !this.data.running
    }, () => {
      this.stop();
      if (this.data.running) {
        // 开始播放音频
        this.play();
      }
    });
  },
  handleBPMChange() {
    if (this.data.running) {
      this.stop();
      this.play();
    }
  },
  _playSound() {
    const audio = wx.createInnerAudioContext();

    this.setData({
      counter: (this.data.counter + 1) % this.data.round
    }, () => {
      const src = this.data.counter % this.data.round === 0 ? tik : tok;
      audio.src = src;
      audio.play();
    });

    audio.onEnded(() => {
      audio.destroy();
    });
  },
  play() {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    const interval = (60 * 1000) / this.data.bpm;
    this._playSound();

    const _this = this;
    this.timer = setTimeout(function task() {
      _this._playSound();
      _this.timer = setTimeout(task, interval);
    }, interval);
  },
  stop() {
    wx.setKeepScreenOn({
      keepScreenOn: false,
    });
    clearTimeout(this.timer);
    // 重置播放计数
    this.setData({
      counter: -1,
    });
  },
});