var npp = require('./new-piece-please')

npp.onready = async () => {
    console.log('**pieces**', npp.pieces.id)

    npp.addNewPiece('QmNR2n4zywCV61MeMLB6JwPueAPqheqpfiA4fLPMxouEmQ')
        .then(cid => {
            // console.log('**node**', npp.node)
            console.log('aaaaaaaa', cid)
            npp.node.dag.get(cid)
                .then(res => {
                    console.log('bbbbbbbb', res)
                })
                .catch(err => console.log('**errrr**', err))
        })

}

console.log('hello')
