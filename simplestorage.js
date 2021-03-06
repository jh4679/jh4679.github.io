var contractAddress = '0x350c35f340c7de692f85f78a8e52ce0c79d002c0';
var abi = [{ "constant": false, "inputs": [{ "name": "x", "type": "string" }], "name": "set", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "get", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }]
var simpleStorageContract;
var simpleStorage;
//0x2662Ca05BE639c0F7DA2aF467e81f88f38BB9A3e
var getParam = function(key) {
    var _parammap = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        _parammap[decode(arguments[1])] = decode(arguments[2]);
    });

    return _parammap[key];
};

window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // Now you can start your app & access web3 freely:
    startApp();
});

function startApp() {

    temp = location.href.split("?");
    //data=temp[1].split(":"); data[1]
    //contractAddress = getParam('value');

    simpleStorageContract = web3.eth.contract(abi);
    simpleStorage = simpleStorageContract.at(contractAddress);
    document.getElementById('contractAddr').innerHTML = getLink(contractAddress);
    web3.eth.getAccounts(function(e, r) {
        document.getElementById('accountAddr').innerHTML = getLink(r[0]);
    });

    getValue();
}

function getLink(addr) {
    return '<a target="_blank" href=https://ropsten.etherscan.io/address/' + addr + '>' + addr + '</a>';
}

function getValue() {
    simpleStorage.get(function(e, r) {
        document.getElementById('storedData').innerHTML = r.toString();

    });
    web3.eth.getBlockNumber(function(e, r) {
        document.getElementById('lastBlock').innerHTML = r;
    });
}

function setValue() {

    var newValue = document.getElementById('newValue').value;
    var txid;
    simpleStorage.set(newValue, function(e, r) {
        document.getElementById('result').innerHTML = 'Transaction id: ' + r + '<span id="pending" style="color:red;">(Pending)</span>';
        txid = r;
    });
    var filter = web3.eth.filter('latest');
    filter.watch(function(e, r) {
        getValue();
        web3.eth.getTransaction(txid, function(e, r) {
            if (r != null && r.blockNumber > 0) {
                document.getElementById('pending').innerHTML = '(기록된 블록: ' + r.blockNumber + ')';
                document.getElementById('pending').style.cssText = 'color:green;';
                document.getElementById('storedData').style.cssText = 'color:green; font-size:300%;';
                filter.stopWatching();
            }
        });
    });
}

function test1() {

    var testValue1 = document.getElementById('testValue1').value;
    showTransactions(testValue1, 1);


}

function test2() {
  
    var testValue2 = document.getElementById('testValue2').value;
    showTransactions(testValue2, 2);

}



function showTransactions(address, flag) {

    if (address != null) {

        var LatestBlockNumber = document.getElementById('lastBlock').innerHTML;
        var i = LatestBlockNumber - 1000;
        var block;

        for (i; i <= LatestBlockNumber; i++) {
            web3.eth.getBlock(i, function(e, r) {
                if (r != null && r.transactions != null) {
                    r.transactions.forEach(function(e) {
                        web3.eth.getTransaction(e, function(e, r) {
                            if (!e) {

                                if (flag == 1) {
                                    if (address == r.from)
                                        console.log(web3.toAscii(r.input).substring(68));
                                } else {
                                    if (address == r.to)
                                        console.log(web3.toAscii(r.input).substring(68));
                                }
                            }
                        });
                    });
                }
            });
        }


    }
}
