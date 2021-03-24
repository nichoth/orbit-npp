var IPFS = require('ipfs')
var OrbitDB = require('orbit-db')

class NewPiecePlease {
    constructor (IPFS, OrbitDB) {
        this.IPFS = IPFS
        this.OrbitDB = OrbitDB

        const initIPFSInstance = async () => {
            return await IPFS.create({
                relay: {
                    enabled: true,
                    hop: { enabled: true, active: true }
                },
                EXPERIMENTAL: { pubsub: true },
                repo: "./path-for-js-ipfs-repo"
            })
        }

        initIPFSInstance().then(async ipfs => {
            // console.log('wooo', ipfs)
            this.node = ipfs
            // this.node.bootstrap.add(undefined, { default: true })
            this._init()
        })
    }

    async _init () {
        // const peerInfo = await this.node.id()
        this.orbitdb = await this.OrbitDB.createInstance(this.node)
        this.defaultOptions = {
            accessController: { write: [this.orbitdb.identity.id] }
        }
        // console.log('**id.id**', this.orbitdb.identity)
        const docStoreOptions = {
            ...this.defaultOptions,
            indexBy: 'hash'
        }
        this.pieces = await this.orbitdb.docstore('pieces', docStoreOptions)
        await this.pieces.load()

        this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
        console.log('**user', this.user)
        await this.user.load()

        // await this.loadFixtureData({
        //     'username': Math.floor(Math.random() * 1000000),
        //     'pieces': this.pieces.id,
        //     'nodeId': peerInfo.id
        // })

        this.node.libp2p.on('peer:connect',
            this.handlePeerConnected.bind(this))

        this.onready()
    }

    handlePeerConnected (ipfsPeer) {
        console.log('** CONNECTED!', ipfsPeer)
        const ipfsId = ipfsPeer.id.toB58String()
        if (this.onpeerconnect) this.onpeerconnect(ipfsId)
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

    async getIpfsPeers () {
        const peers = await this.node.swarm.peers()
        return peers
    }

    async connectToPeer (multiaddr, protocol = '/p2p-circuit/ipfs/') {
        try {
            console.log('swarm.connect: ', protocol + multiaddr)
            await this.node.swarm.connect(protocol + multiaddr)
        } catch (err) {
            console.log('oh no', err)
            throw (err)
        }
    }

    async updatePieceByHash (hash, instrument = 'Piano') {
        const piece = await this.getPieceByHash(hash)
        piece.instrument = instrument
        const cid = await this.pieces.put(piece)
        // console.log('**cid here**', cid)
        return cid
    }

    async deletePieceByHash (hash) {
        const cid = await this.pieces.del(hash)
        return cid
    }

    async addNewPiece (hash, instrument = 'Piano') {
        const existingPiece = this.getPieceByHash(hash)
        console.log('***existing', existingPiece)
        if (existingPiece) {
            const cid = await this.updatePieceByHash(hash, instrument)
            return cid
        }

        const cid = await this.pieces.put({
            _id: 'hello world',
            hash,
            doc: { hash, instrument }
        })
        // console.log('**cid**', cid)
        return cid
    }
}

window.npp = module.exports = new NewPiecePlease(IPFS, OrbitDB)
