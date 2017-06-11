pragma solidity ^0.4.0;

contract HelloworldContract{
    string word ="Hello World";
    address Creator;

    function HelloworldContract(){//contract의 생성자
        Creator = msg.sender;   
    }

    modifier ifCreator(){
        if(Creator != msg.sender){
            throw;
        }
        else{
            _;// 언더바는 continue를 의미함
        }
    }
    function getWord() constant returns(string){
        return word;
    }

    function setWord(string newWord) ifCreator returns(string){
            word = newWord;
            return "Hi Creator! your request was successful!";
        
    }
}