//const express = require('express');
//const mustacheExpress = require('mustache-express');
//const os = require('os');
//const { Pool } = require('pg');

import {Slot_machine} from "./slot_machine.js";
import express from 'express';
import mustacheExpress from 'mustache-express';
import os from 'os';
import pg from 'pg';
const { Pool } = pg;
const __dirname = import.meta.dirname;

const app = express();
app.use(express.static('public'))
app.set('view engine', 'html');
app.engine('html', mustacheExpress());          // register file extension
app.set('views', __dirname);

const port = 3000;
const dbhost = process.env.DB_HOST || 'localhost';
console.log(`DB_HOST: ${dbhost}`);
const pool = new Pool({
    host: dbhost,
    user: 'dockeruser',
    password: '$PG_PASSWORD',
    database: 'leaderboard',
    port: 5432,
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Application listening on port ${port}`)
})


class Main {
    //Class Variables
    
    #money = 100;
    #slot_machines = [];
    #section = document.createElement("section");

    constructor() {
        //Appending Dynamic Section to HTML
        document.addEventListener("DOMContentLoaded", () => {
            this.#section.className = "txtSection"
            document.body.appendChild(this.#section);
            let section = document.createElement("section");
            section.id = "slotMachine"
            document.body.appendChild(section);
            let btnDiv = document.createElement("div");
            btnDiv.className = "btnDiv";
            let cashout = document.createElement("button");
            cashout.id = "cashOut";
            cashout.textContent = "Cashout";
            btnDiv.appendChild(cashout);
            document.body.appendChild(btnDiv);
        });
        // Create instances of Slot_machine and add them to the array
        for (let i = 0; i < 3; i++) {
            const slotMachine = new Slot_machine();
            this.#slot_machines.push(slotMachine);
        }
    }

    playAll() {
        if (this.#money > 0) {
            var total_winnings = 0;
            //Calling the slot machine play function
            for (const machine of this.#slot_machines) {
                this.#money--;
                machine.play();
                total_winnings += machine.last_amount_won;
            }
            this.#money += total_winnings;

            let condition = function () {
                if (total_winnings > 0) return "Round's Total Winnings: " + total_winnings;
                else return "No Winnings"
            }()

            this.#section.innerHTML = "Total Money: " + this.#money + "<br>" + condition
        } else this.#section.innerHTML = "NO MORE MONEY :(";
    }
    
    getMoney() {
        return this.#money;
    }
    
    reset() {
        this.#money = 100;
        this.#section.innerHTML = "";
    }
}

//Button functionality
let main = new Main();

function playGame() {
    main.playAll();
    return 0;
}

//This function gets called on Cashout
function cashOut(){
    let playerName = document.getElementById("playerName").value;
    let money = main.getMoney();
    //Connect DB here
    //async function insertData(tableName, username, user_score) {
    //const client = await pool.connect();
    //const query = INSERT INTO ${tableName} (playername,score) VALUES (${username}, ${user_score}) RETURNING *;
    //const result = await client.query(query, values);
    // return result.rows;
//}
    main.reset();
    return [money, playerName];
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("play").addEventListener("click", playGame)
    document.getElementById("cashOut").addEventListener("click", () => console.log(cashOut()))
    
});
