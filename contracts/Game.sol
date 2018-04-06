contract Game {

    address owner;
    uint highScore;
    address highScorer;

    function Game() {
        owner = msg.sender;
    }

    function submitScore(uint score) payable returns (bool, uint) {
        if(msg.value < 1 ether) {
            return (false, 0);
        }
        if(score > highScore) {
            highScore = score;
            highScorer = msg.sender;
            uint balance = owner.balance;
            msg.sender.send(this.balance);
            return (true, balance);
        }
        return (false,0);
    }
}