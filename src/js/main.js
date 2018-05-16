// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var debounce = require("./lib/debounce");

var startTime = new Date();
var dollarsPerDay = 266;
var centsPerSecond = (dollarsPerDay * 100) / (24 * 60 * 60);

var timeCounters = $(".elapsed");
var moneyCounters = $(".price-increase");

var plural = n => n === 1 ? "" : "s";

var formatTime = function(secs) {
  var parts = [];
  if (secs >= 60 * 60) {
    var numHours = Math.floor(secs / (60 * 60));
    parts.push(`${numHours} hour${plural(numHours)}`);
    secs %= (60 * 60)
  }
  if (secs >= 60) {
    var numMinutes = Math.floor(secs / 60);
    parts.push(`${numMinutes} minute${plural(numMinutes)}`);
    secs %= 60;
  }
  parts.push(`${secs} second${plural(secs)}`);
  return parts.join(" and ");
};

var formatMoney = function(cents) {
  if (cents >= `100`) return `$${cents / 100}`;
  return `${cents} cent${plural(cents)}`;
};

var tick = function() {
  var elapsed = new Date() - startTime;
  var elapsedSeconds = Math.round(elapsed / 1000);
  var increasedCents = Math.round(centsPerSecond * elapsedSeconds);

  var timeOutput = formatTime(elapsedSeconds);
  var moneyOutput = formatMoney(increasedCents);
  timeCounters.forEach((elem) => {
    elem.innerHTML = timeOutput;
  })
  moneyCounters.forEach((elem) => {
    elem.innerHTML = moneyOutput;
  })
};

setInterval(tick, 1000);

// Cash piles
var onScroll = debounce(function() {
  var viewportHeight = window.innerHeight;
  $(".cash-pile").forEach((cash) => {
    var bounds = cash.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > viewportHeight) return;
    console.log(cash);
    var proportionScrolled = (viewportHeight - bounds.top) / viewportHeight;
    var horizontalMax = cash.parentNode.getBoundingClientRect().width - 2 * 16 - 100; // TK fix up
    console.log(proportionScrolled * horizontalMax);
    cash.style.left = `${proportionScrolled * horizontalMax}px`;
  });
}, 15);

window.addEventListener("scroll", onScroll);
