import { Component } from '@angular/core';
import * as moment from 'moment';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  timerStarted;   // bool
  timerPaused;    // bool
  number;         // input, e.g. 30
  interval = 60000;       // seconds, minutes, or hours
  timer;          // the interval timer
  remainingTime;  // in ms
  displayTime;    // calculated every 500ms

  constructor(private nativeAudio: NativeAudio) {
    this.timerStarted = false;
    this.timerPaused = false;
    this.nativeAudio.preloadSimple('bells', 'assets/bells.mp3');
    this.nativeAudio.preloadSimple('horn', 'assets/horn.mp3');
  }

  // remove the elapsed time, and check if we need to send notice
  updateTime() {
    if (this.timerPaused) return;
    this.remainingTime = this.remainingTime - 500;
    this.getCountdown();
    if (this.remainingTime <= 0) {
      this.sendAlert();
      this.setRemainingTime();
    }
  }

  setRemainingTime() {
    this.remainingTime = this.number * this.interval;
  }

  sendAlert() {
    let value = Math.random();
    if (value < .05) {
      this.nativeAudio.play('horn');
    } else {
      this.nativeAudio.play('bells');
    }
  }

  getCountdown() {
    let tempTime = this.remainingTime;
    let buildingString = "";

    let hours = Math.floor(tempTime / 3600000);
    tempTime = tempTime - (hours * 3600000);
    if (hours > 0) {
      buildingString += `${hours}h `;
    }

    let minutes = Math.floor(tempTime / 60000);
    tempTime = tempTime - (minutes * 60000);
    buildingString += `${minutes}m `;

    let seconds = Math.floor(tempTime / 1000);
    tempTime = tempTime - (hours * 1000);
    buildingString += `${seconds}s `;

    this.displayTime = buildingString;
  }

  startTimer() {
    this.setRemainingTime();
    this.timerStarted = true;
    this.timer = setInterval(() => {
      this.updateTime();
    }, 500);
  }

  togglePause() {
    this.timerPaused = !this.timerPaused;
  }

  resetTimer() {
    this.timerStarted = false;
    this.timerPaused = false;
    clearInterval(this.timer);
  }

  intervalChanged(event) {
    this.interval = Number(event.detail.value);
  }

}
