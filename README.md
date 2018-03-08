# blockapps-sample-game
BlockApps Sample Game

## Using initfile.json
In addition to naming and versioning your app in `metadata.json`, you can also use
`initfile.json` to upload contracts during the blockchain and having their addresses
available through a javascript library.

```
{
    "gameContract": {
      "contractName": "SampleGame",
      "contractFilename": "contracts/SampleGame.sol",
      "args": {}
    }
}
```
For each key supplied in `initfile.json`, a javascript variable will be created.
Strato will use the `contractName`, `contractFilename`, and `args` in order
to decide which uploaded contract to use and which arguments to provide to
the constructor. In this case, `contract SampleGame` in `contracts/SampleGame.sol`
has no arguments for its constructor so the empty object will suffice. In other
constructors, you should use an object with a key for each parameter to that
constructor.

After upload, an `addresses.js` file will be generated. An example module looks like:
```
const addresses = {
  gameContract: "81b081f69a1998b3eefcbfde419ec7f57944cf1a",
};
```

Then to make use of this address, include `<script src="addresses.js"></script>` in
the dapp's `index.html` so that `addresses.gameContract` will describe the uploaded
contract in javascript blocks:
```
let callContractMethodUrl = window.location.origin + "/bloc/v2.2/users" +
      path.join(username, userAddress, "contract", contractName,
                addresses.gameContract, "call?resolve");
```
