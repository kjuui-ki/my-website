function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5oXyt16xSfC":
        Script1();
        break;
      case "5jObQWWFHaB":
        Script2();
        break;
      case "6a9kBhLhF5e":
        Script3();
        break;
      case "5yh4uXdcJDd":
        Script4();
        break;
      case "6ozHk24VCCG":
        Script5();
        break;
      case "6lUBYVvhMZk":
        Script6();
        break;
      case "6rBmFoHOXzl":
        Script7();
        break;
      case "61Cfl72ffZQ":
        Script8();
        break;
      case "5ZBVDUNFJBi":
        Script9();
        break;
      case "6Zn7GWyOMtc":
        Script10();
        break;
      case "5qm4C3L6WpH":
        Script11();
        break;
      case "6raUGVmHQ8b":
        Script12();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  const target = object('5tKMistGNCj');
const duration = 500;
const easing = 'ease-out';
const id = '62aH4BnECpV';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script2 = function()
{
  const target = object('5tKMistGNCj');
const duration = 500;
const easing = 'ease-out';
const id = '62aH4BnECpV_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script3 = function()
{
  const target = object('5h0AZa6t9Lg');
const duration = 500;
const easing = 'ease-out';
const id = '6QKLt43nrcg';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script4 = function()
{
  const target = object('5h0AZa6t9Lg');
const duration = 500;
const easing = 'ease-out';
const id = '6QKLt43nrcg_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script5 = function()
{
  const target = object('6i0RatG8ZOS');
const duration = 500;
const easing = 'ease-out';
const id = '60gbptgNDae';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script6 = function()
{
  const target = object('6i0RatG8ZOS');
const duration = 500;
const easing = 'ease-out';
const id = '60gbptgNDae_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script7 = function()
{
  const target = object('6GpXY9mJ6PG');
const duration = 500;
const easing = 'ease-out';
const id = '6nhpapS4tEw';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script8 = function()
{
  const target = object('6GpXY9mJ6PG');
const duration = 500;
const easing = 'ease-out';
const id = '6nhpapS4tEw_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script9 = function()
{
  const target = object('5Vo1jxI987w');
const duration = 500;
const easing = 'ease-out';
const id = '6fQRj8xqsHb';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script10 = function()
{
  const target = object('5Vo1jxI987w');
const duration = 500;
const easing = 'ease-out';
const id = '6fQRj8xqsHb_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script11 = function()
{
  const target = object('5wfz4dybPs4');
const duration = 500;
const easing = 'ease-out';
const id = '6RZkRB8TM8c';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script12 = function()
{
  const target = object('5wfz4dybPs4');
const duration = 500;
const easing = 'ease-out';
const id = '6RZkRB8TM8c_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

};
