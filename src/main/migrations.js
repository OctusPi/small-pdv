import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

const dbPath = path.join(__dirname, 'database.sqlite')

function createTables(){
    if(!fs.existsSync(dbPath)){
        const db = new sqlite3.Database(dbPath)
        creteTableSettings(db)
        creteTableTares(db)
        creteTableProducts(db)
        creteTableOrders(db)

        db.close(err => {
            if(err){
                console.log('falha ao fechar conexao com db')
            }else{
                console.log('banco criado com sucesso')
            }
        })
    }
}

function creteTableSettings(db){
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            logomarca TEXT,
            company VARCHAR (255),
            address VARCHAR (255),
            phone VARCHAR (255),
            adminpass VARCHAR (255),
            token VARCHAR (255)
        )`)
    })
}

function creteTableTares(db){
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Tares (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            weight [DOUBLE PRECISION],
            type INTEGER,
            pic VARCHAR (255),
            description VARCHAR (255)
        )`)
    })
}

function creteTableProducts(db){
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Products (
            id          INTEGER            PRIMARY KEY AUTOINCREMENT,
            cod         VARCHAR (255),
            name        VARCHAR (255),
            sale        INTEGER,
            unitpeso    [DOUBLE PRECISION],
            unitval     [DOUBLE PRECISION],
            pic         VARCHAR (255),
            description VARCHAR (255)
        )`)
    })
}

function creteTableOrders(db){
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS Orders (
            id          INTEGER            PRIMARY KEY AUTOINCREMENT,
            seller      VARCHAR (255),
            cod         VARCHAR (255),
            dateandtime DATETIME,
            items       JSON,
            total       [DOUBLE PRECISION],
            status      TINYINT (1)
        )`)
    })
}

export default {
    createTables
}