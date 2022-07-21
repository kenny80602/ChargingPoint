import { ChargerUnConnected } from '../utils/errors.js'
let centralSystem = null

export const init = (cs) => {
    centralSystem = cs
}

export const handler = (req, res, next) => {
    try {
        const poleId = req.params.poleId || req.body.poleId
        const pole = centralSystem.poles.find((e) => e.poleId === poleId)
    
        if (!pole) throw new ChargerUnConnected()
        else {
            req.pole = pole
            next()
        }
    } catch (error) {
        next(error)
    }
}
