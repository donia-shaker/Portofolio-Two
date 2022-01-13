//function of Dark-Light Mode
function changeMode() {
  var checkBox = document.getElementById("switch");
  var action = document.getElementById("action"); //add action ti image
  if (checkBox.checked) {
    document.documentElement.style.setProperty("--background-color", "#111");
    document.documentElement.style.setProperty("--main-color", "#fff");
    action.style.opacity = "65%"; //add action to image
  } else {
    document.documentElement.style.setProperty("--background-color", "#fff");
    document.documentElement.style.setProperty("--main-color", "#111");
    action.style.opacity = "1"; //add action to image
  }
}
