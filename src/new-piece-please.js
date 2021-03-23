var IPFS = require('ipfs')
// var OrbitDB = require('orbit-db')

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

    async addNewPiece (hash, instrument = 'Piano') {
        // const existingPiece = this.getPieceByHash(hash)
        // if (existingPiece) {
        //     // await this.updatePieceByHash(hash, instrument)
        //     return
        // }

    
        console.log('** in here**', hash)
        // const cid = await this.pieces.put({ hash, instrument })
        const cid = await this.pieces.put({
            _id: 'hello world',
            hash,
            doc: { hash, instrument }
        })
        console.log('**cid**', cid)
        return cid
    }
}

// module.exports = NewPiecePlease

// window.npp = module.exports = new NewPiecePlease(Ipfs, OrbitDB)
window.npp = module.exports = new NewPiecePlease(window.Ipfs, window.OrbitDB)
