var IPFS = require('ipfs')
var OrbitDB = require('orbit-db')

class NewPiecePlease {
    constructor (Ipfs, OrbitDB) {
        this.Ipfs = Ipfs
        this.OrbitDB = OrbitDB

        const initIPFSInstance = async () => {
            return await IPFS.create({ repo: "./path-for-js-ipfs-repo" })
        }

        initIPFSInstance().then(async ipfs => {
            console.log('wooo', ipfs)
            this.node = ipfs
            this._init()
        })
    }

    async _init () {
        console.log('this.node', this.node)
        this.orbitdb = await this.OrbitDB.createInstance(this.node)
        this.defaultOptions = {
            accessController: { write: [this.orbitdb.identity.id] }
        }
        console.log('**id.id**', this.orbitdb.identity)
        const docStoreOptions = {
            ...this.defaultOptions,
            indexBy: 'hash'
        }
        this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
        await this.pieces.load()
        this.onready()
    }

    getAllPieces () {
        const pieces = this.pieces.get('')
        return pieces
    }

    getPieceByHash (hash) {
        const singlePiece = this.pieces.get(hash)[0]
        return singlePiece
    }

    getPieceByInstrument (instrument) {
        return this.pieces.query(piece => piece.instrument === instrument)
    }

    async updatePieceByHash (hash, instrument = 'Piano') {
        const piece = await this.getPieceByHash(hash)
        console.log('**piece here***', piece)
        piece.instrument = instrument
        const cid = await this.pieces.put(piece)
        console.log('**cid here**', cid)
        return cid
    }

    async addNewPiece (hash, instrument = 'Piano') {
        console.log('**hash**', hash)
        const existingPiece = this.getPieceByHash(hash)
        console.log('***existing', existingPiece)
        if (existingPiece) {
            await this.updatePieceByHash(hash, instrument)
            return existingPiece.hash
        }

        console.log('** in here**', hash)
        const cid = await this.pieces.put({
            _id: 'hello world',
            hash,
            doc: { hash, instrument }
        })
        console.log('**cid**', cid)
        return cid
    }
}

window.npp = module.exports = new NewPiecePlease(IPFS, OrbitDB)
