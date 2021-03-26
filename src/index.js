var IPFS = require('ipfs')
var OrbitDB = require('orbit-db')
var NPP = require('./new-piece-please')


var npp = new NPP(IPFS, OrbitDB)


// window.LOG='orbit*'

// https://github.com/orbitdb/field-manual/blob/master/01_Tutorial/02_Managing_Data.md#storing-media-files

npp.onready = async () => {
    // console.log('**pieces**', npp.pieces.id)

    const id = await npp.node.id()
    console.log('id.addresses', id.addresses)

    npp.node.bootstrap.list()
        .then(res => console.log('**bootstrap', res))







    npp.pieces.events.on('replicated', (ev) => {
        console.log('original db replicated', ev)
    })



    
    var npp2 = new NPP(IPFS, OrbitDB, npp.pieces.address)

    npp2.onready = async () => {
        npp.onpeerconnect = info => console.log('onpeerconnect', info)
        // await npp.connectToPeer(npp2.pieces.address)
        // some time later, outputs 'QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX'


        // npp2.connectToPeer(npp.pieces.address.toString())

        npp2.pieces.events.on('replicated', ev => {
            console.log('replicated**!!,', ev)
        })





        npp.addNewPiece('QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
            .then(async cid => {
                npp.node.dag.get(cid)
                    .then(res => {
                        console.log('dag.get cid', res)
                    })
                    .catch(err => console.log('**errrr**', err))

                // const _cid = await NPP.updatePiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
                //     "Harpsichord")
                // do stuff with the cid as above
                
                // const _cid = await npp.deletePieceByHash(
                //     'QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
                const content = await npp.node.dag.get(cid)
                console.log('added piece', content.value.payload)
            })





        console.log('npp', npp.pieces.address.toString())
        console.log('npp2', npp2.pieces.address.toString())

    }



    
    console.log('***peers***', await npp.getIpfsPeers())

}

console.log('hello')
