var npp = require('./new-piece-please')

// https://github.com/orbitdb/field-manual/blob/master/01_Tutorial/02_Managing_Data.md#storing-media-files

npp.onready = async () => {
    // console.log('**pieces**', npp.pieces.id)

    const id = await npp.node.id()
    console.log('id.addresses', id.addresses)

    npp.addNewPiece('QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
        .then(async cid => {
            // console.log('**node**', npp.node)
            console.log('aaaaaaaa', cid)
            npp.node.dag.get(cid)
                .then(res => {
                    console.log('bbbbbbbb', res)
                })
                .catch(err => console.log('**errrr**', err))

            // const _cid = await NPP.updatePiece("QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ",
            //     "Harpsichord")
            // do stuff with the cid as above
            
            const _cid = await npp.deletePieceByHash(
                'QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
            const content = await npp.node.dag.get(_cid)
            console.log('value.payload', content.value.payload)
        })

    npp.node.bootstrap.list()
        .then(res => console.log('**bootstrap', res))


    npp.onpeerconnect = info => console.log('onperrconnect', info)
    await npp.connectToPeer('QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX')
    // some time later, outputs 'QmWxWkrCcgNBG2uf1HSVAwb9RzcSYYC2d6CRsfJcqrz2FX'

    
    console.log('***peers***', await npp.getIpfsPeers())

}

console.log('hello')
