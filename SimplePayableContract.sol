pragma solidity ^0.4.0;

contract PayableContract{

    address client;
    bool _switch = false;
    
    event updateStatus(string _msg);
    event userStatus(string _msg, address user, uint amount);
    
    function PayableContract(){//contract의 생성자
        client = msg.sender;   
    }
    function depositFunds() payable{
        userStatus("deposit was updated",msg.sender,msg.value);
    }
    modifier ifclient(){
        if(client != msg.sender){
            throw;
        }
        else{
            _;// 언더바는 continue를 의미함
        }
    }
    function withdrawFunds(uint amount) ifclient{
        if(client.send(amount)){
            updateStatus("withdraw was success");
            _switch = true;
        }
        else{
            _switch = false;
        }
    }
    function getFunds() ifclient constant returns(uint){
        updateStatus("someone called a getter");
        return this.balance;
    }
}