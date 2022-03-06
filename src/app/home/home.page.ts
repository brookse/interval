import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  timerStarted;   // bool
  timerPaused;    // bool
  number;         // input, e.g. 30
  interval = 1000;       // seconds, minutes, or hours
  timer;          // the interval timer
  remainingTime;  // in ms
  displayTime;    // calculated every 500ms
  horn;
  bells;

  displaySeconds;
  displayMinutes;
  displayHours;

  constructor() {
    this.timerStarted = false;
    this.timerPaused = false;
    this.setupAudio();
  }

  setupAudio() {
    this.bells = new Audio();
    this.horn = new Audio();
    this.bells.src = 'assets/bells.mp3';
    this.horn.src = 'assets/horn.mp3';
    this.bells.load();
    this.horn.load();
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
      this.horn.play();
    } else {
      this.bells.play();
    }
  }

  getCountdown() {
    let tempTime = this.remainingTime;
    let buildingString = "";

    let hours = Math.floor(tempTime / 3600000);
    tempTime = tempTime - (hours * 3600000);
    if (hours > 0) {
      this.displayHours = hours;
    }

    let minutes = Math.floor(tempTime / 60000);
    tempTime = tempTime - (minutes * 60000);
    this.displayMinutes = minutes;

    let seconds = Math.floor(tempTime / 1000);
    tempTime = tempTime - (hours * 1000);
    this.displaySeconds = seconds;
  }

  startTimer() {
    this.setRemainingTime();
    this.timerStarted = true;
    this.timer = setInterval(() => {
      this.updateTime();
    }, 500);
  }

  pauseTimer() {
    this.timerPaused = true;
  }

  unpauseTimer() {
    this.timerPaused = false;
  }

  resetTimer() {
    this.timerStarted = false;
    this.timerPaused = false;
    this.displayHours = null;
    this.displayMinutes = 0;
    this.displaySeconds = 0;
    clearInterval(this.timer);
  }

  intervalChanged(event) {
    this.interval = Number(event.target.value);
  }

}
