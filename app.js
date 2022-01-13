function changeMode() {
  var checkBox = document.getElementById("switch");
  if (checkBox.checked) {
    document.documentElement.style.setProperty("--background-color", "#111");
    document.documentElement.style.setProperty("--main-color", "#fff");
  } else {
    document.documentElement.style.setProperty("--background-color", "#fff");
    document.documentElement.style.setProperty("--main-color", "#111");
  }
}
