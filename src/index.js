var npp = require('./new-piece-please')

npp.onready = async () => {
    console.log('**pieces**', npp.pieces.id)

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

}

console.log('hello')
