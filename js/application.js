window.onload = function () {
  let request = new XMLHttpRequest();
  let contractName = "DemoGame";
  let callContractMethodUrl = "http://cd10.eastus.cloudapp.azure.com/bloc/v2.2/search/"+contractName + "?owner=eq.b65c360624346fe70678119808dbf72d1f744545";

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if(JSON.parse(this.responseText).length > 0) {
        let address = JSON.parse(this.responseText)[0];
        // Wait till the browser is ready to render the game (avoids glitches)
        window.requestAnimationFrame(function () {
          new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, contractName, address);
        });
      } else {
        alert('Contract not found');
      }
    }
  }
  
  request.open("GET", callContractMethodUrl, true);
  request.send();
};