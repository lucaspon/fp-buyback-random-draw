const { ethers } = require('ethers');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();


// List of people who will get a Tier 1 Autoglyph
const group1 = [
    "dgntec",
    "Klamt_eth",
    "mram4122",
    "renato_shira",
    "Road Capital",
]

// List of people who will get a tier 2 Autoglyph
const group2 = [
    "flo.eth",
    "lambr.eth",
    "nickyg / nickgrossman",
]

const symbolSchemesperTokenId = {
    "131": "1",
    "462": "1",
    "471": "1",
    "156": "1",
    "161": "1",
    "448": "1",
    "165": "2",
    "313": "2",
    "362": "2",
    "413": "2",
    "433": "2",
    "451": "2",
    // "134": "2",
    // "181": "2",
    // "228": "3",
    // "238": "3",
    // "152": "3",
    // "333": "3",
    // "344": "3",
    // "359": "3",
    // "483": "4",
    // "138": "4",
    // "430": "5",
    // "287": "6",
    // "158": "7",
    // "233": "7",
}

const autoglyphs_abi = [
    {
        "constant": true,
        "inputs": [{ "name": "_interfaceID", "type": "bytes4" }],
        "name": "supportsInterface",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    { "constant": true, "inputs": [], "name": "TOKEN_LIMIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "_name", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" },
    {
        "constant": true,
        "inputs": [{ "name": "_tokenId", "type": "uint256" }],
        "name": "getApproved",
        "outputs": [{ "name": "", "type": "address" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [{ "name": "_approved", "type": "address" }, { "name": "_tokenId", "type": "uint256" }],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    { "constant": true, "inputs": [], "name": "ARTIST_PRINTS", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
    {
        "constant": false,
        "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }],
        "name": "transferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_index", "type": "uint256" }],
        "name": "tokenOfOwnerByIndex",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    { "constant": true, "inputs": [], "name": "BENEFICIARY", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" },
    {
        "constant": true,
        "inputs": [{ "name": "_id", "type": "uint256" }],
        "name": "symbolScheme",
        "outputs": [{ "name": "", "type": "uint8" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "id", "type": "uint256" }],
        "name": "draw",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }],
        "name": "safeTransferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "index", "type": "uint256" }],
        "name": "tokenByIndex",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_id", "type": "uint256" }],
        "name": "creator",
        "outputs": [{ "name": "", "type": "address" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "name": "_owner", "type": "address" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    { "constant": true, "inputs": [], "name": "PRICE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "_symbol", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" },
    {
        "constant": false,
        "inputs": [{ "name": "_operator", "type": "address" }, { "name": "_approved", "type": "bool" }],
        "name": "setApprovalForAll",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_tokenId", "type": "uint256" }, { "name": "_data", "type": "bytes" }],
        "name": "safeTransferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_tokenId", "type": "uint256" }],
        "name": "tokenURI",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": false,
        "inputs": [{ "name": "seed", "type": "uint256" }],
        "name": "createGlyph",
        "outputs": [{ "name": "", "type": "string" }],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
    },
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_operator", "type": "address" }],
        "name": "isApprovedForAll",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
    },
    { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" },
    {
        "anonymous": false,
        "inputs": [{ "indexed": true, "name": "index", "type": "uint256" }, { "indexed": true, "name": "a", "type": "address" }, { "indexed": false, "name": "value", "type": "string" }],
        "name": "Generated",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "_from", "type": "address" },
            { "indexed": true, "name": "_to", "type": "address" },
            { "indexed": true, "name": "_tokenId", "type": "uint256" },
        ],
        "name": "Transfer",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "_owner", "type": "address" },
            { "indexed": true, "name": "_approved", "type": "address" },
            { "indexed": true, "name": "_tokenId", "type": "uint256" },
        ],
        "name": "Approval",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "_owner", "type": "address" },
            { "indexed": true, "name": "_operator", "type": "address" },
            { "indexed": false, "name": "_approved", "type": "bool" },
        ],
        "name": "ApprovalForAll",
        "type": "event",
    },
]

const ags_owned_by_fp = [
    131,
    462,
    471,
    156,
    161,
    448,
    165,
    313,
    362,
    413,
    433,
    451,
    134,
    181,
    228,
    238,
    152,
    333,
    344,
    359,
    483,
    138,
    430,
    287,
    158,
    233,
]

// Function to check the symbol scheme of a token
async function checkSymbolScheme(token_id) {
    // get INFURA from .env
    let INFURA = process.env.INFURA;
    let infura_url = `https://mainnet.infura.io/v3/${INFURA}`;

    // Set up provider and contract
    const provider = new ethers.JsonRpcProvider(infura_url);
    const contract_address = '0xd4e4078ca3495de5b1d4db434bebc5a986197782';
    const contract = new ethers.Contract(contract_address, autoglyphs_abi, provider);

    try {
        // Call the contract method
        const symbol_scheme = await contract.symbolScheme(token_id);
        schemeObject = {
            token_id: token_id.toString(), // Convert token_id to string if it's a BigInt
            symbol_scheme: symbol_scheme.toString(),
        }
        return schemeObject;
    } catch (error) {
        return null;
    }
}

// Function to find the symbol schemes of all tokens
async function findTokenSymbolSchemes() {
    let symbolSchemesperToken = [];

    for (let i = 0; i < ags_owned_by_fp.length; i++) {
        const token_id = ags_owned_by_fp[i];
        const symbol_scheme = await checkSymbolScheme(token_id);
        symbolSchemesperToken.push(symbol_scheme);
    }

    console.log(symbolSchemesperToken);

    // create an object for the array
    let symbolSchemesperTokenObj = {};
    symbolSchemesperToken.forEach((item) => {
        symbolSchemesperTokenObj[item.token_id] = item.symbol_scheme;
    });

    // save to json file
    fs.writeFileSync('symbolSchemesperToken.json', JSON.stringify(symbolSchemesperTokenObj));
}

// Seed the random generator using a simple hash-based approach
async function seededRandom(seed) {
    return parseInt(crypto.createHash('sha256').update(seed.toString()).digest('hex').slice(0, 8), 16) / 0xFFFFFFFF;
}

// Shuffle an array using the Fisher-Yates algorithm
async function shuffleArray(array, seed) {
    let rng = seededRandom(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function filterAutoglyphsBySymbolScheme(symbolScheme) {
    return ags_owned_by_fp.filter((tokenId) => symbolSchemesperTokenId[tokenId] === symbolScheme);
}

// --------------------------------------------------

function seededRandom(seed) {
    return function () {
        const hash = crypto.createHash('sha256').update(seed.toString()).digest('hex');
        seed = BigInt('0x' + hash);
        return Number(seed % 1000000n) / 1000000;
    };
}

async function shuffleArray(array, seed) {
    let rng = seededRandom(seed); // Initialize RNG with seed
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
    return array;
}

async function main() {
    // Block hash of Ethereum block #XYZ
    const blockHash = "0x573219245e1b197be818b07ef42801957faaaed6afdb52c140d83ec218d01637";
    console.log("Seeded Hash: ", blockHash);
    console.log()

    // Convert block hash to an integer
    const seed = BigInt(blockHash);

    let tierOneAutoglyphs = await filterAutoglyphsBySymbolScheme("1");
    let tierTwoAutoglyphs = await filterAutoglyphsBySymbolScheme("2");

    console.log("Tier 1 Autoglyphs: ", tierOneAutoglyphs);
    console.log("Tier 2 Autoglyphs: ", tierTwoAutoglyphs);
    console.log();

    // Shuffle the list of NFTs for both groups using the seeded shuffle function
    tierOneAutoglyphs = await shuffleArray(tierOneAutoglyphs, seed);
    tierTwoAutoglyphs = await shuffleArray(tierTwoAutoglyphs, seed);

    let results = {}

    console.log("First group:");
    const assignedtierOneAutoglyphs = await tierOneAutoglyphs.slice(0, 5);
    assignedtierOneAutoglyphs.forEach((nft, index) => {
        console.log(`${group1[index]} is assigned ${nft}`);
        results[group1[index]] = nft
    });
    console.log();

    console.log("Second group:");
    const assignedtierTwoAutoglyphs = await tierTwoAutoglyphs.slice(0, 3);
    assignedtierTwoAutoglyphs.forEach((nft, index) => {
        console.log(`${group2[index]} is assigned ${nft}`);
        results[group2[index]] = nft
    });

    // Save the results to a JSON file
    fs.writeFileSync('results.json', JSON.stringify(results));
}

main();
