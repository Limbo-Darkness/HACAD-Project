// Slot Machine Class
class Slot_machine {
    // Class Variables
    #last_amount_won;
    #nums;
    #img_list = this.#make_img_list();
    // Dictionary for the different Icons
    #slot_machine_icons = [
        {0: "https://img.icons8.com/external-those-icons-fill-those-icons/96/external-Seven-casino-and-leisure-those-icons-fill-those-icons.png"},
        {1: "https://img.icons8.com/cotton/64/banana.png"},
        {2: "https://img.icons8.com/cotton/64/watermelon-2.png"},
        {3: "https://img.icons8.com/cotton/64/sour-lemon-.png"},
        {4: "https://img.icons8.com/cotton/64/cherry--v1.png"},
        {5: "https://img.icons8.com/cotton/64/grape.png"},
        {6: "https://img.icons8.com/cotton/64/orange--v1.png"}
    ]

    get last_amount_won() {
        return this.#last_amount_won;
    }

    constructor() {
        // Declaring last_amount_won to zero
        this.#last_amount_won = 0;
        // Create slot section structure
        let slot_section = document.createElement("section");
        slot_section.className = "slotSection";
        let outerDiv = document.createElement("div");
        outerDiv.className = "outerDiv";
        for (let img of this.#img_list) {
            img.src = this.#getIconUrl(this.#randomNumbers()[0]);
            let inner_div = document.createElement("div");
            inner_div.className = "innerDiv";
            inner_div.appendChild(img);
            outerDiv.appendChild(inner_div);
        }
        this.#img_list[1].parentElement.className += " middleDiv";
        slot_section.appendChild(outerDiv);
        document.getElementById("slotMachine").appendChild(slot_section);
    }

    // Playing the Slot machines
    play() {
        this.#nums = this.#randomNumbers();
        for (let i = 0; i < this.#img_list.length; i++) {
            this.#img_list[i].src = this.#getIconUrl(this.#nums[i]);
            this.#img_list[i].alt = this.#nums[i];
        }
        this.#last_amount_won = this.#calc_winnings(this.#nums);
    }

    // Function to make the list with the right formatting
    #make_img_list() {
        let img1 = document.createElement("img");
        let img2 = document.createElement("img");
        let img3 = document.createElement("img");
        let img_list = [img1, img2, img3];
        for (let img of img_list) {
            img.height = 64;
            img.width = 64;
        }
        return img_list;
    }

    // Picking 3 random numbers from [0-6]
    #randomNumbers() {
        let numberList = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            numberList[i] = Math.floor(Math.random() * 7);
        }
        return numberList;
    }

    // Using the Dictionary to get the correct URL
    #getIconUrl(key) {
        const iconObject = this.#slot_machine_icons.find(obj => key in obj);
        return iconObject ? iconObject[key] : null;
    }

    // Calculate the total winnings of the slot machine
    #calc_winnings(num_list) {
        let first = num_list[0];
        let second = num_list[1];
        let third = num_list[2];

        if (first === second && second === third) {
            if (first === 0) return 14;
            else return 7;
        } else if (first === second) {
            if (first === 0) return 4;
            else return 3;
        } else if (second === third) {
            if (second === 0) return 3;
            else return 2;
        } else if (first === 0) return 1;
        else return 0;
    }
}

// Main Game Class
class Main {
    // Class Variables
    #money = 100;
    #slot_machines = [];
    #section;

    constructor() {
        this.#section = document.querySelector(".txtSection");
        
        // Create instances of Slot_machine and add them to the array
        for (let i = 0; i < 3; i++) {
            const slotMachine = new Slot_machine();
            this.#slot_machines.push(slotMachine);
        }
        
        // Initial money display
        this.#section.innerHTML = "Total Money: " + this.#money;
    }

    playAll() {
        if (this.#money > 0) {
            var total_winnings = 0;
            // Calling the slot machine play function
            for (const machine of this.#slot_machines) {
                this.#money--;
                machine.play();
                total_winnings += machine.last_amount_won;
            }
            this.#money += total_winnings;

            let condition = function () {
                if (total_winnings > 0) return "Round's Total Winnings: " + total_winnings;
                else return "No Winnings";
            }();

            this.#section.innerHTML = "Total Money: " + this.#money + "<br>" + condition;
        } else {
            this.#section.innerHTML = "NO MORE MONEY :(";
        }
    }
    
    getMoney() {
        return this.#money;
    }
    
    reset() {
        this.#money = 100;
        this.#section.innerHTML = "Total Money: " + this.#money;
    }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize main game
    let main = new Main();

    // Button functionality
    function playGame() {
        main.playAll();
        return 0;
    }

    // This function gets called on Cashout
    async function cashOut() {
        let playerName = document.getElementById("playerName").value;
        if (!playerName.trim()) {
            alert("Please enter a player name before cashing out!");
            return;
        }
        
        let money = main.getMoney();
        
        // Connect to server API to save score
        try {
            const response = await fetch('/api/save-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerName, score: money })
            });
            
            const result = await response.json();
            if (result.success) {
                alert(`Score saved! ${playerName}: ${money}`);
            } else {
                alert('Failed to save score: ' + result.error);
            }
        } catch (err) {
            console.error("Error saving score:", err);
            alert('Failed to save score. Check console for details.');
        }
        
        main.reset();
        return [money, playerName];
    }

    // Set up event listeners
    document.getElementById("play").addEventListener("click", playGame);
    document.getElementById("cashOut").addEventListener("click", cashOut);
});
