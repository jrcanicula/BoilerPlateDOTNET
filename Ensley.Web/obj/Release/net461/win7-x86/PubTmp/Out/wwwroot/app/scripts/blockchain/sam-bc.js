//var abiSAM = [{ "constant": false, "inputs": [{ "name": "x", "type": "uint256" }], "name": "set", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "get", "outputs": [{ "name": "", "type": "uint256", "value": "0" }], "payable": false, "stateMutability": "view", "type": "function" }];
//var contractAddressSAM = "0x42b757F5285112fBcb7Cb42d807BEE9aE4958c4d";
//var cryptoSAM;

//window.addEventListener('load', function () {    
//        // set the provider you want from Web3.providers
//    web3js = new Web3(new Web3.providers.HttpProvider("http://65.52.193.26:8545/"));    

//    startApp();
//});

//function startApp() {  

//    cryptoSAM = new web3js.eth.Contract(abiSAM, contractAddressSAM);

//    get().then(function (response) {
//        alert(response);
//    });


   

//    web3js.eth.net.isListening().then((s) => {
//        console.log('We\'re still connected to the node');
//    }).catch((e) => {
//        console.log('Lost connection to the node, reconnecting');
//        //web3.setProvider(your_provider_here);
//    })
//}

//var address = "0x764e2418F8E122250701833bE3822fdea228AC13";
//var privateKey = "0xc3295e3d300438e1ca35d4dfd1780f0d3fb0ea9c30d3815e6370a28217a69065";// 0xc3295e3d300438e1ca35d4dfd1780f0d3fb0ea9c30d3815e6370a28217a69065


//function set() {

   
  


//    var query = cryptoSAM.methods.set(1);
//    var encodedABI = query.encodeABI();

//    const tx = {
//        from: address,
//        to: contractAddressSAM,
//        gas: 2000000,
//        data: encodedABI,
//    };

//    var account = web3js.eth.accounts.privateKeyToAccount(privateKey);

//    alert(account);

//    web3js.eth.getBalance(address).then(function (e) { alert(e)});

//    web3js.eth.accounts.signTransaction(tx, privateKey).then(signed => {
//        var tran = web3js.eth.sendSignedTransaction(signed.rawTransaction);
          
        
//        tran.on('confirmation', (confirmationNumber, receipt) => {
//            alert('=> confirmation: ' + confirmationNumber);
//        });

//        tran.on('transactionHash', hash => {
//            console.log('=> hash');
//            alert('hash' + hash);
//        });

//            tran.on('receipt', receipt => {
//                console.log('=> reciept');
//                alert('receipt' + receipt);
//            })
//            tran.on('error', alert("error"));
//    });



//    //account.signTransaction(tx, key)
//    //    .then(console.log);
//    //{
//    //    alert("test");
//    //    debugger;
//    //    //messageHash: '0x88cfbd7e51c7a40540b233cf68b62ad1df3e92462f1c6018d6d67eae0f3b08f5',
//    //    //v: '0x25',
//    //    //r: '0xc9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895',
//    //    //s: '0x727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68',
//    //    //rawTransaction: '0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68'
//    //}


//    debugger;


//    //return cryptoSAM.methods.set(1)
//    //    .send({ from: address })
//    //    .on("receipt", function (receipt) {
//    //        alert("success");
//    //    })
//    //    .on("error", function (error) {
//    //        alert("error");
//    //    });
//}

//function get() {
//    return cryptoSAM.methods.get().call();
//}

//function createKeys() {
//    web3js.eth.accounts.create();
//}